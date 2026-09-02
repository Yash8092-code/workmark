import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import Application from '../models/Application';
import Job from '../models/Job';
import Notification from '../models/Notification';
import User from '../models/User';
import { paginate } from '../utils/helpers';
import emailService from '../services/email.service';

export const applyToJob = asyncHandler(async (req: Request, res: Response) => {
  if (req.user?.role !== 'job_seeker') {
    throw new AppError('Only job seekers can apply to jobs', 403);
  }

  const { jobId } = req.params;
  const { coverLetter, resumeUrl } = req.body;

  const job = await Job.findById(jobId);

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

  const application = await Application.create({
    jobId,
    applicantId: req.user._id,
    employerId: job.employerId,
    coverLetter,
    resumeUrl,
    statusHistory: [{ status: 'pending', changedAt: new Date() }],
  });

  await Notification.create({
    userId: job.employerId,
    type: 'application',
    title: 'New Job Application',
    message: `${req.user.name} applied to your job: ${job.title}`,
    link: `/employer/applications/${application._id}`,
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

  for (const application of result.data) {
    await application.populate({
      path: 'applicantId',
      populate: { path: 'profile' },
    });
  }

  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

export const getApplication = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const application = await Application.findById(id)
    .populate('applicantId', 'name email avatar')
    .populate('jobId')
    .populate('employerId', 'name email');

  if (!application) {
    throw new AppError('Application not found', 404);
  }

  if (
    application.applicantId._id.toString() !== req.user?._id.toString() &&
    application.employerId._id.toString() !== req.user?._id.toString()
  ) {
    throw new AppError('Not authorized to view this application', 403);
  }

  res.status(200).json({
    success: true,
    data: { application },
  });
});

export const updateApplicationStatus = asyncHandler(async (req: Request, res: Response) => {
  if (req.user?.role !== 'employer') {
    throw new AppError('Only employers can update application status', 403);
  }

  const { id } = req.params;
  const { status } = req.body;

  const application = await Application.findById(id);

  if (!application) {
    throw new AppError('Application not found', 404);
  }

  if (application.employerId.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to update this application', 403);
  }

  application.status = status;
  application.statusHistory.push({ status, changedAt: new Date() });
  await application.save();

  await Notification.create({
    userId: application.applicantId,
    type: 'application_status',
    title: 'Application Status Updated',
    message: `Your application status has been updated to: ${status}`,
    link: `/seeker/applications`,
  });

  // Send application status email if applicant has enabled email notifications
  try {
    const applicant = await User.findById(application.applicantId);
    const job = await Job.findById(application.jobId).populate('companyId');

    if (applicant && applicant.email && (applicant.emailNotifications?.applicationUpdates !== false)) {
      const companyName = (job?.companyId as any)?.name || job?.companyName || 'Company';
      const clientUrl = process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173';
      const applicationUrl = `${clientUrl}/seeker/applications`;

      await emailService.sendApplicationStatusEmail({
        to: applicant.email,
        name: applicant.name,
        jobTitle: job?.title || 'Job Opening',
        companyName,
        status,
        applicationUrl,
      });
    }
  } catch (emailErr) {
    console.error('[EMAIL] Failed to send application status email:', emailErr);
  }

  res.status(200).json({
    success: true,
    message: 'Application status updated successfully',
    data: { application },
  });
});
