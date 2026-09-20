import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import Job from '../models/Job';
import Company from '../models/Company';
import Profile from '../models/Profile';
import Application from '../models/Application';
import SavedJob from '../models/SavedJob';
import Notification from '../models/Notification';
import {
  calculateOpportunityIntelligence,
  extractAndNormalizeSkills,
  OpportunityExplanation,
} from '../services/opportunity.service';
import { getCountry } from '../config/countries';

export const getSeekerDashboard = asyncHandler(async (req: Request, res: Response) => {
  if (req.user?.role !== 'job_seeker') {
    throw new AppError('Only job seekers can access the seeker dashboard', 403);
  }

  const userId = req.user._id;

  // 1. Fetch Profile and User data
  const profile = await Profile.findOne({ userId });

  // 2. Compute 10-Point Profile Readiness
  const readinessChecks = [
    { key: 'headline', label: 'Professional Headline', valid: Boolean(profile?.headline?.trim()) },
    { key: 'bio', label: 'About / Bio Summary', valid: Boolean(profile?.bio?.trim()) },
    { key: 'phone', label: 'Contact Phone', valid: Boolean(profile?.phone?.trim()) },
    { key: 'location', label: 'City / Location', valid: Boolean(profile?.location?.trim()) },
    { key: 'avatar', label: 'Profile Avatar', valid: Boolean(req.user?.avatar) },
    { key: 'resume', label: 'Uploaded Resume', valid: Boolean(profile?.resumeUrl) },
    { key: 'skills', label: 'Core Skills (at least 3)', valid: Boolean(profile?.skills && profile.skills.length >= 3) },
    { key: 'experience', label: 'Work Experience', valid: Boolean(profile?.experience && profile.experience.length > 0) },
    { key: 'education', label: 'Education History', valid: Boolean(profile?.education && profile.education.length > 0) },
    {
      key: 'preferences',
      label: 'Job Preferences (Work mode / Country)',
      valid: Boolean(req.user?.countryCode || req.user?.jobAlertPreferences?.workModes?.length),
    },
  ];

  const completedItems = readinessChecks.filter((c) => c.valid).map((c) => c.label);
  const missingItems = readinessChecks.filter((c) => !c.valid).map((c) => c.label);
  const readinessPercentage = Math.round((completedItems.length / readinessChecks.length) * 100);

  // 3. Applications Pipeline Aggregation
  const applications = await Application.find({ applicantId: userId });
  const pipeline = {
    pending: 0,
    reviewed: 0,
    shortlisted: 0,
    interview: 0,
    accepted: 0,
    rejected: 0,
  };

  for (const app of applications) {
    if ((pipeline as any)[app.status] !== undefined) {
      (pipeline as any)[app.status]++;
    }
  }

  const activeApplicationsCount = pipeline.pending + pipeline.reviewed + pipeline.shortlisted + pipeline.interview;
  const savedJobsCount = await SavedJob.countDocuments({ userId });

  // 4. Personalized Recommendations (Optimized query with Opportunity Intelligence)
  const countryCode = (req.user?.countryCode || '').toLowerCase();
  
  // Fetch up to 60 active jobs to evaluate
  const candidateJobs = await Job.find({ status: 'active' })
    .populate('companyId', 'name logo')
    .sort({ createdAt: -1 })
    .limit(60);

  const scoredJobsWithIntel: Array<{
    job: any;
    intel: OpportunityExplanation;
  }> = [];

  for (const rawJob of candidateJobs) {
    const jobObj = typeof rawJob.toObject === 'function' ? rawJob.toObject() : { ...rawJob };
    const intel = calculateOpportunityIntelligence(jobObj, req.user, profile);
    scoredJobsWithIntel.push({
      job: {
        ...jobObj,
        matchScore: intel.score > 0 ? intel.score : undefined,
        opportunityIntelligence: intel,
      },
      intel,
    });
  }

  // Deduplicate and bucket into Top 6 per section
  const strongMatches: any[] = [];
  const skillStretch: any[] = [];
  const remoteAndGlobal: any[] = [];
  const recentlyAdded: any[] = [];

  for (const item of scoredJobsWithIntel) {
    // Strong matches (score >= 75)
    if (item.intel.score >= 75 && strongMatches.length < 6) {
      strongMatches.push(item.job);
    }
    // Skill stretch (tagged Skill Stretch)
    if (item.intel.tags.includes('Skill Stretch') && skillStretch.length < 6) {
      skillStretch.push(item.job);
    }
    // Remote & Global
    if ((item.intel.tags.includes('Remote') || item.intel.tags.includes('Global')) && remoteAndGlobal.length < 6) {
      remoteAndGlobal.push(item.job);
    }
    // Recently Added (fresh)
    if (item.intel.tags.includes('Fresh') && recentlyAdded.length < 6) {
      recentlyAdded.push(item.job);
    }
  }

  // Fallbacks if fewer scored jobs exist
  if (recentlyAdded.length === 0 && candidateJobs.length > 0) {
    recentlyAdded.push(...scoredJobsWithIntel.slice(0, 6).map((s) => s.job));
  }

  const strongMatchesCount = scoredJobsWithIntel.filter((s) => s.intel.score >= 75).length;

  // 5. Skill Insights based on active database demand
  const userSkills = profile?.skills || req.user?.jobAlertPreferences?.keywords || [];
  const primaryCategory = req.user?.jobAlertPreferences?.categories?.[0] || 'Engineering';

  // Aggregate in-demand skills from current category jobs
  const skillFrequency: Record<string, number> = {};
  for (const item of candidateJobs) {
    const extracted = extractAndNormalizeSkills(item.title, item.description, item.skills);
    for (const skill of extracted) {
      skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
    }
  }

  const inDemandSkills = Object.entries(skillFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([skill, jobCount]) => ({ skill, jobCount }));

  const countryDisplayName = getCountry(countryCode)?.name || 'Global';
  const marketContext = `Based on ${candidateJobs.length} active opportunities in ${countryDisplayName}`;

  // 6. Recent Persisted Activity Feed
  const recentApplications = await Application.find({ applicantId: userId })
    .populate({
      path: 'jobId',
      select: 'title companyName',
      populate: { path: 'companyId', select: 'name' },
    })
    .sort({ createdAt: -1 })
    .limit(4);

  const recentSaved = await SavedJob.find({ userId })
    .populate('jobId', 'title companyName')
    .sort({ createdAt: -1 })
    .limit(3);

  const recentNotifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(3);

  const activityFeed: Array<{
    id: string;
    type: 'application_submitted' | 'job_saved' | 'status_updated' | 'notification';
    title: string;
    description: string;
    timestamp: Date;
    link?: string;
  }> = [];

  for (const app of recentApplications) {
    const jobTitle = (app.jobId as any)?.title || 'Role';
    const compName = (app.jobId as any)?.companyId?.name || (app.jobId as any)?.companyName || 'Employer';
    activityFeed.push({
      id: app._id.toString(),
      type: 'application_submitted',
      title: `Applied to ${jobTitle}`,
      description: `Application status: ${app.status.toUpperCase()} at ${compName}`,
      timestamp: app.createdAt,
      link: '/seeker/applications',
    });
  }

  for (const saved of recentSaved) {
    const jobTitle = (saved.jobId as any)?.title || 'Saved Position';
    activityFeed.push({
      id: saved._id.toString(),
      type: 'job_saved',
      title: `Bookmarked ${jobTitle}`,
      description: 'Saved to your career opportunities list',
      timestamp: saved.createdAt,
      link: '/seeker/saved-jobs',
    });
  }

  for (const notif of recentNotifications) {
    activityFeed.push({
      id: notif._id.toString(),
      type: 'notification',
      title: notif.title,
      description: notif.message,
      timestamp: notif.createdAt,
      link: notif.link,
    });
  }

  // Sort chronological descending
  activityFeed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  res.status(200).json({
    success: true,
    data: {
      profileReadiness: {
        percentage: readinessPercentage,
        completedItems,
        missingItems,
      },
      metrics: {
        activeApplications: activeApplicationsCount,
        savedJobs: savedJobsCount,
        strongMatchesCount,
        shortlistedCount: pipeline.shortlisted,
      },
      pipeline,
      recommendations: {
        strongMatches,
        skillStretch,
        remoteAndGlobal,
        recentlyAdded,
      },
      skillInsights: {
        userSkills,
        inDemandSkills,
        marketContext,
      },
      recentActivity: activityFeed.slice(0, 8),
    },
  });
});

export const getEmployerDashboard = asyncHandler(async (req: Request, res: Response) => {
  if (req.user?.role !== 'employer') {
    throw new AppError('Only employers can access the employer dashboard', 403);
  }

  const employerId = req.user._id;

  // 1. Fetch Employer Company
  const company = await Company.findOne({ ownerId: employerId });

  // 2. Company Profile Readiness
  const companyChecks = [
    { key: 'name', label: 'Company Name', valid: Boolean(company?.name?.trim()) },
    { key: 'logo', label: 'Company Logo', valid: Boolean(company?.logo) },
    { key: 'coverImage', label: 'Cover Banner', valid: Boolean(company?.coverImage) },
    { key: 'description', label: 'About Company', valid: Boolean(company?.description?.trim()) },
    { key: 'industry', label: 'Industry Sector', valid: Boolean(company?.industry?.trim()) },
    { key: 'companySize', label: 'Team Size', valid: Boolean(company?.companySize?.trim() || company?.size?.trim()) },
    { key: 'location', label: 'Headquarters Location', valid: Boolean(company?.location?.trim()) },
    { key: 'website', label: 'Official Website', valid: Boolean(company?.website?.trim()) },
  ];

  const completedItems = companyChecks.filter((c) => c.valid).map((c) => c.label);
  const missingItems = companyChecks.filter((c) => !c.valid).map((c) => c.label);
  const companyReadinessPercentage = Math.round((completedItems.length / companyChecks.length) * 100);

  // 3. Fetch Employer's Jobs & Applications (Strict Data Ownership)
  const jobs = await Job.find({ employerId }).sort({ createdAt: -1 });
  const jobIds = jobs.map((j) => j._id);

  const applications = await Application.find({ employerId })
    .populate('applicantId', 'name email avatar')
    .populate('jobId', 'title category skills experienceLevel location workMode')
    .sort({ createdAt: -1 });

  // 4. Recruitment Pipeline Calculation
  const pipeline = {
    pending: 0,
    reviewed: 0,
    shortlisted: 0,
    interview: 0,
    accepted: 0,
    rejected: 0,
  };

  for (const app of applications) {
    if ((pipeline as any)[app.status] !== undefined) {
      (pipeline as any)[app.status]++;
    }
  }

  const activeJobsCount = jobs.filter((j) => j.status === 'active').length;
  const totalApplications = applications.length;
  const candidatesToReview = pipeline.pending;
  const shortlistedCandidates = pipeline.shortlisted;
  const interviewCandidates = pipeline.interview;
  const hiresCount = pipeline.accepted;

  // 5. "Candidates Needing Attention" Review Queue (Pending & Reviewed)
  const pendingApplicants = applications
    .filter((app) => app.status === 'pending' || app.status === 'reviewed')
    .slice(0, 8);

  const candidatesNeedingAttention = [];
  for (const app of pendingApplicants) {
    const applicantUser = app.applicantId as any;
    const appliedJob = app.jobId as any;
    const applicantProfile = await Profile.findOne({ userId: applicantUser?._id });

    // Compute candidate match against this specific job
    let candidateScore: number | undefined = undefined;
    if (appliedJob && applicantProfile) {
      const intel = calculateOpportunityIntelligence(appliedJob, applicantUser, applicantProfile);
      candidateScore = intel.score;
    }

    candidatesNeedingAttention.push({
      applicationId: app._id.toString(),
      applicantId: applicantUser?._id?.toString() || '',
      applicantName: applicantUser?.name || 'Applicant',
      applicantEmail: applicantUser?.email || '',
      applicantPhone: applicantProfile?.phone || applicantUser?.phone || '',
      applicantAvatar: applicantUser?.avatar,
      jobId: appliedJob?._id?.toString() || '',
      jobTitle: appliedJob?.title || 'Open Position',
      appliedAt: app.appliedAt || app.createdAt,
      status: app.status,
      isViewedByEmployer: app.isViewedByEmployer || false,
      matchScore: candidateScore,
      skills: applicantProfile?.skills || [],
    });
  }

  // 6. Active Job Performance Table
  const jobPerformance = jobs.map((job) => {
    const appCount = applications.filter((app) => (app.jobId as any)?._id?.toString() === job._id.toString()).length;
    const views = job.views || 0;
    const conversionRate = views > 0 ? Math.round((appCount / views) * 100) : undefined;

    return {
      jobId: job._id.toString(),
      title: job.title,
      location: job.location,
      workMode: job.workMode,
      status: job.status,
      applicationsCount: appCount,
      viewsCount: views,
      conversionRate,
      createdAt: job.createdAt,
    };
  });

  // 7. Recruitment Insights with Minimum Data Threshold
  const hasEnoughData = totalApplications >= 3 || jobs.length >= 2;
  const insights: string[] = [];

  if (hasEnoughData) {
    if (candidatesToReview > 0) {
      insights.push(`You have ${candidatesToReview} candidate${candidatesToReview > 1 ? 's' : ''} awaiting initial screening across ${activeJobsCount} active openings.`);
    }
    if (shortlistedCandidates > 0) {
      insights.push(`${shortlistedCandidates} candidate${shortlistedCandidates > 1 ? 's are' : ' is'} currently in the shortlisted review stage.`);
    }
    const mostAppliedJob = [...jobPerformance].sort((a, b) => b.applicationsCount - a.applicationsCount)[0];
    if (mostAppliedJob && mostAppliedJob.applicationsCount > 0) {
      insights.push(`"${mostAppliedJob.title}" has generated the highest applicant interest with ${mostAppliedJob.applicationsCount} application${mostAppliedJob.applicationsCount > 1 ? 's' : ''}.`);
    }
  } else {
    insights.push('Post open positions and receive candidate applications to unlock recruitment analytics and funnel insights.');
  }

  res.status(200).json({
    success: true,
    data: {
      companyReadiness: {
        percentage: companyReadinessPercentage,
        completedItems,
        missingItems,
      },
      metrics: {
        activeJobs: activeJobsCount,
        totalApplications,
        candidatesToReview,
        shortlistedCandidates,
        interviewCandidates,
        hiresCount,
      },
      pipeline,
      candidatesNeedingAttention,
      jobPerformance,
      recruitmentInsights: {
        hasEnoughData,
        insights,
      },
    },
  });
});
