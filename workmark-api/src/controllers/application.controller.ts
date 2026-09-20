import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import Application from '../models/Application';
import Job from '../models/Job';
import Profile from '../models/Profile';
import Notification from '../models/Notification';
import User from '../models/User';
import { paginate } from '../utils/helpers';
import emailService from '../services/email.service';
import { calculateOpportunityIntelligence } from '../services/opportunity.service';
import { ApplicationStatus } from '../types';

// Legal recruitment state transitions
const ALLOWED_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  pending: ['reviewed', 'rejected'],
  reviewed: ['shortlisted', 'rejected'],
  shortlisted: ['interview', 'accepted', 'rejected'],
  interview: ['interview', 'accepted', 'shortlisted', 'rejected'],
  accepted: [],
  rejected: [],
};

export const applyToJob = asyncHandler(async (req: Request, res: Response) => {
  if (req.user?.role !== 'job_seeker') {
    throw new AppError('Only job seekers can apply to jobs', 403);
  }

  const { jobId } = req.params;
  const { coverLetter } = req.body;
  let { resumeUrl } = req.body;

  const job = await Job.findById(jobId).populate('companyId');

  if (!job) {
    throw new AppError('Job not found', 404);
  }

  if (job.status !== 'active') {
    throw new AppError('This job is not accepting applications', 400);
  }

  if (job.isExternal || job.source === 'adzuna' || !job.employerId) {
    throw new AppError('External jobs must be applied to on the source site', 400);
  }

  if (job.deadline && new Date(job.deadline) < new Date()) {
    throw new AppError('Application deadline has passed', 400);
  }

  const existingApplication = await Application.findOne({
    jobId,
    applicantId: req.user._id,
  });

  if (existingApplication) {
    throw new AppError('You have already applied to this job', 400);
  }

  // If no resume URL was provided in request, fallback to seeker's profile resume
  if (!resumeUrl) {
    const seekerProfile = await Profile.findOne({ userId: req.user._id });
    resumeUrl = seekerProfile?.resumeUrl;
  }

  const now = new Date();
  const application = await Application.create({
    jobId,
    applicantId: req.user._id,
    employerId: job.employerId,
    coverLetter,
    resumeUrl,
    status: 'pending',
    isViewedByEmployer: false,
    appliedAt: now,
    statusHistory: [
      {
        status: 'pending',
        changedAt: now,
        note: 'Application submitted',
        changedBy: req.user._id,
      },
    ],
  });

  // Notify the employer with direct deep-link to candidate application
  await Notification.create({
    userId: job.employerId,
    type: 'application',
    title: 'New Job Application',
    message: `${req.user.name} applied to your opportunity: ${job.title}`,
    link: `/employer/applicants/${application._id}`,
  });

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    data: { application },
  });
});

export const getMyApplications = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, status } = req.query;

  const query: any = { applicantId: req.user?._id };

  if (status) {
    query.status = status;
  }

  const result = await paginate(
    Application,
    query,
    { page: Number(page) || 1, limit: Number(limit) || 10 },
    ['jobId', 'employerId'],
    { createdAt: -1 }
  );

  for (const application of result.data) {
    await application.populate('jobId');
    await application.populate({
      path: 'jobId',
      populate: { path: 'companyId' },
    });
  }

  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

export const getJobApplications = asyncHandler(async (req: Request, res: Response) => {
  if (req.user?.role !== 'employer') {
    throw new AppError('Only employers can view job applications', 403);
  }

  const { jobId } = req.params;
  const { page, limit, status } = req.query;

  const job = await Job.findById(jobId);

  if (!job) {
    throw new AppError('Job not found', 404);
  }

  if (!job.employerId || job.employerId.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to view applications for this job', 403);
  }

  const query: any = { jobId };

  if (status) {
    query.status = status;
  }

  const result = await paginate(
    Application,
    query,
    { page: Number(page) || 1, limit: Number(limit) || 10 },
    ['applicantId', 'jobId'],
    { createdAt: -1 }
  );

  const enhancedData = [];
  for (const app of result.data) {
    const applicantUser = app.applicantId as any;
    const applicantProfile = applicantUser?._id ? await Profile.findOne({ userId: applicantUser._id }) : null;

    let candidateScore: number | undefined = undefined;
    if (job && applicantProfile && applicantUser) {
      const intel = calculateOpportunityIntelligence(job.toObject(), applicantUser, applicantProfile);
      candidateScore = intel.score;
    }

    const appObj = app.toObject ? app.toObject() : { ...app };
    enhancedData.push({
      ...appObj,
      profile: applicantProfile,
      matchScore: candidateScore,
    });
  }

  res.status(200).json({
    success: true,
    data: enhancedData,
    pagination: result.pagination,
  });
});

export const getApplication = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const application = await Application.findById(id)
    .populate('applicantId', 'name email avatar phone countryCode countryName createdAt')
    .populate({
      path: 'jobId',
      populate: { path: 'companyId' },
    })
    .populate('employerId', 'name email');

  if (!application) {
    throw new AppError('Application not found', 404);
  }

  const isApplicant = application.applicantId._id.toString() === req.user?._id.toString();
  const isEmployer = application.employerId._id.toString() === req.user?._id.toString();

  if (!isApplicant && !isEmployer) {
    throw new AppError('Not authorized to view this application', 403);
  }

  // If employer opened application, mark isViewedByEmployer = true
  if (isEmployer && !application.isViewedByEmployer) {
    application.isViewedByEmployer = true;
    await application.save();
  }

  // Fetch applicant's full profile
  const applicantProfile = await Profile.findOne({ userId: application.applicantId._id });

  // Calculate match score against this job
  let matchScore: number | undefined = undefined;
  let opportunityIntelligence: any = undefined;
  if (application.jobId && applicantProfile) {
    const rawJob = typeof (application.jobId as any).toObject === 'function' ? (application.jobId as any).toObject() : application.jobId;
    opportunityIntelligence = calculateOpportunityIntelligence(rawJob, application.applicantId, applicantProfile);
    matchScore = opportunityIntelligence.score;
  }

  res.status(200).json({
    success: true,
    data: {
      application,
      profile: applicantProfile,
      matchScore,
      opportunityIntelligence,
    },
  });
});

export const updateApplicationStatus = asyncHandler(async (req: Request, res: Response) => {
  if (req.user?.role !== 'employer') {
    throw new AppError('Only employers can update application status', 403);
  }

  const { id } = req.params;
  const {
    status,
    note,
    interviewAction,
    interviewDate,
    interviewTime,
    interviewMode,
    interviewLocation,
    interviewMessage,
    cancelledReason,
  } = req.body;

  const application = await Application.findById(id);

  if (!application) {
    throw new AppError('Application not found', 404);
  }

  if (application.employerId.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to update this application', 403);
  }

  const currentStatus = application.status as ApplicationStatus;
  let targetStatus = (status || currentStatus) as ApplicationStatus;

  // Handle Interview Cancellation action: reverts to shortlisted
  if (interviewAction === 'cancel') {
    targetStatus = 'shortlisted';
  }

  // State Machine Validation
  const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
  const isReschedule = currentStatus === 'interview' && (interviewAction === 'reschedule' || targetStatus === 'interview');

  if (currentStatus !== targetStatus && !allowed.includes(targetStatus)) {
    throw new AppError(
      `Invalid status transition from "${currentStatus}" to "${targetStatus}".`,
      400
    );
  }

  const now = new Date();
  application.status = targetStatus;

  // Update stage-specific timestamp
  if (targetStatus === 'reviewed' && !application.reviewedAt) application.reviewedAt = now;
  if (targetStatus === 'shortlisted' && !application.shortlistedAt) application.shortlistedAt = now;
  if (targetStatus === 'interview') application.interviewAt = now;
  if (targetStatus === 'accepted') application.acceptedAt = now;
  if (targetStatus === 'rejected') application.rejectedAt = now;

  // Handle interview metadata
  if (targetStatus === 'interview' || interviewAction === 'schedule' || interviewAction === 'reschedule') {
    application.interview = {
      status: interviewAction === 'reschedule' ? 'rescheduled' : 'scheduled',
      scheduledAt: now,
      date: interviewDate || application.interview?.date,
      time: interviewTime || application.interview?.time,
      mode: interviewMode || application.interview?.mode || 'video',
      locationOrLink: interviewLocation || application.interview?.locationOrLink,
      message: interviewMessage || application.interview?.message,
    };
  } else if (interviewAction === 'cancel') {
    application.interview = {
      ...application.interview,
      status: 'cancelled',
      cancelledReason: cancelledReason || note || 'Cancelled by employer',
    };
  }

  // Append to status history
  let historyNote = note;
  if (!historyNote) {
    if (interviewAction === 'schedule') historyNote = `Interview scheduled for ${interviewDate} ${interviewTime}`;
    else if (interviewAction === 'reschedule') historyNote = `Interview rescheduled to ${interviewDate} ${interviewTime}`;
    else if (interviewAction === 'cancel') historyNote = `Interview cancelled: ${cancelledReason || 'No reason provided'}`;
    else historyNote = `Status changed to ${targetStatus}`;
  }

  application.statusHistory.push({
    status: targetStatus,
    changedAt: now,
    note: historyNote,
    changedBy: req.user._id,
  });

  await application.save();

  // Populate job details for notification and email
  const job = await Job.findById(application.jobId).populate('companyId');
  const jobTitle = job?.title || 'Job Opening';
  const companyName = (job?.companyId as any)?.name || job?.companyName || 'Employer';

  // Construct context-rich seeker notification with deep-link
  let notifTitle = 'Application Status Updated';
  let notifMessage = `Your application for "${jobTitle}" has been updated to: ${targetStatus}.`;

  if (targetStatus === 'reviewed') {
    notifTitle = 'Application Under Review';
    notifMessage = `Your application for "${jobTitle}" at ${companyName} is now under review.`;
  } else if (targetStatus === 'shortlisted') {
    if (interviewAction === 'cancel') {
      notifTitle = 'Interview Cancelled';
      notifMessage = `The scheduled interview for "${jobTitle}" was cancelled. Your application remains shortlisted.`;
    } else {
      notifTitle = 'Application Shortlisted!';
      notifMessage = `Congratulations! You have been shortlisted for "${jobTitle}" at ${companyName}.`;
    }
  } else if (targetStatus === 'interview') {
    if (interviewAction === 'reschedule') {
      notifTitle = 'Interview Rescheduled';
      notifMessage = `Your interview for "${jobTitle}" has been rescheduled to ${interviewDate || 'the requested time'}.`;
    } else {
      notifTitle = 'Interview Requested';
      notifMessage = `You have been invited for an interview for "${jobTitle}" at ${companyName} on ${interviewDate || ''} ${interviewTime || ''}.`;
    }
  } else if (targetStatus === 'accepted') {
    notifTitle = 'Application Accepted / Offer!';
    notifMessage = `Congratulations! Your application for "${jobTitle}" at ${companyName} has been accepted.`;
  } else if (targetStatus === 'rejected') {
    notifTitle = 'Application Update';
    notifMessage = `Your application for "${jobTitle}" was not selected to move forward at this time.`;
  }

  await Notification.create({
    userId: application.applicantId,
    type: 'application_status',
    title: notifTitle,
    message: notifMessage,
    link: `/seeker/applications?applicationId=${application._id}`,
  });

  // Send status email if enabled
  try {
    const applicant = await User.findById(application.applicantId);
    if (applicant && applicant.email && applicant.emailNotifications?.applicationUpdates !== false) {
      const clientUrl = process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173';
      const applicationUrl = `${clientUrl}/seeker/applications?applicationId=${application._id}`;

      await emailService.sendApplicationStatusEmail({
        to: applicant.email,
        name: applicant.name,
        jobTitle,
        companyName,
        status: targetStatus,
        applicationUrl,
      });
    }
  } catch (emailErr) {
    console.error('[EMAIL] Failed to send status email:', emailErr);
  }

  res.status(200).json({
    success: true,
    message: 'Application status updated successfully',
    data: { application },
  });
});
