import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import Job from '../models/Job';
import Company from '../models/Company';
import Profile from '../models/Profile';
import Application from '../models/Application';
import { calculateOpportunityIntelligence } from '../services/opportunity.service';
import {
  paginate,
  buildSortQuery,
  parseArrayParam,
  matchesJobFilter,
  calculateJobMatchScore,
  JobFilterCriteria,
} from '../utils/helpers';
import { FilterQuery } from 'mongoose';
import { IJobs } from '../types';
import { searchExternalJobs } from '../services/adzuna.service';
import { getCountry } from '../config/countries';
import jobAlertService from '../services/job-alert.service';

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const asString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value.trim() : undefined;

const asNumber = (value: unknown): number | undefined => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const createJob = asyncHandler(async (req: Request, res: Response) => {
  if (req.user?.role !== 'employer') {
    throw new AppError('Only employers can create jobs', 403);
  }

  const { companyId } = req.body;

  const company = await Company.findById(companyId);

  if (!company) {
    throw new AppError('Company not found', 404);
  }

  if (company.ownerId.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to post jobs for this company', 403);
  }

  let salary = req.body.salary;
  if (!salary && (req.body.salaryMin !== undefined || req.body.salaryMax !== undefined)) {
    salary = {
      min: req.body.salaryMin ? Number(req.body.salaryMin) : undefined,
      max: req.body.salaryMax ? Number(req.body.salaryMax) : undefined,
      currency: req.body.salaryCurrency || 'USD',
      period: req.body.salaryPeriod === 'year' ? 'yearly' : req.body.salaryPeriod === 'month' ? 'monthly' : (req.body.salaryPeriod || 'yearly'),
    };
  } else if (salary && salary.period) {
    if (salary.period === 'year') salary.period = 'yearly';
    if (salary.period === 'month') salary.period = 'monthly';
    if (salary.period === 'hour') salary.period = 'hourly';
  }

  const country = req.body.country || company.location || 'India';
  const countryCode = req.body.countryCode || (req.user as any).countryCode || 'in';

  const job = await Job.create({
    ...req.body,
    ...(salary ? { salary } : {}),
    country,
    countryCode,
    employerId: req.user._id,
    companyName: company.name,
    companyLogo: company.logo,
  });

  if (job.status === 'active') {
    void jobAlertService.processJobAlertsForNewJobs([job]);
  }

  res.status(201).json({
    success: true,
    message: 'Job created successfully',
    data: { job },
  });
});

export const getJobs = asyncHandler(async (req: Request, res: Response) => {
  const {
    search: rawSearch,
    keyword,
    location,
    city,
    country,
    source,
    salaryMin,
    salaryMax,
    salaryDisclosed,
    datePosted,
    page,
    limit,
    sort,
    sortBy,
    sortOrder,
  } = req.query;

  const search = asString(rawSearch) || asString(keyword);
  const cityLocation = asString(city) || asString(location);
  const countryValue = asString(country);

  if (countryValue && countryValue !== 'all' && !getCountry(countryValue)) {
    throw new AppError('Unsupported country code', 400);
  }

  const workModes = parseArrayParam(req.query.workMode || req.query['workMode[]']);
  const categories = parseArrayParam(req.query.category || req.query['category[]']);
  const employmentTypes = parseArrayParam(req.query.employmentType || req.query['employmentType[]']);
  const experienceLevels = parseArrayParam(req.query.experienceLevel || req.query['experienceLevel[]']);
  const skills = parseArrayParam(req.query.skills || req.query['skills[]']);

  const pageNumber = Math.max(1, asNumber(page) || 1);
  const limitNumber = Math.min(50, Math.max(1, asNumber(limit) || 20));
  const sourceValue = asString(source) || 'all';

  // Date posted parsing
  const dateMap: { [key: string]: number } = {
    today: 1,
    '24h': 1,
    '3d': 3,
    '7d': 7,
    '30d': 30,
  };
  const datePostedDays = datePosted ? dateMap[String(datePosted).toLowerCase()] : undefined;

  // Build MongoDB query
  const query: FilterQuery<IJobs> = { status: 'active' };

  if (sourceValue === 'workmark') query.source = 'workmark';
  if (sourceValue === 'adzuna') query.source = 'adzuna';

  if (countryValue && countryValue !== 'all') {
    query.countryCode = countryValue.toLowerCase();
  }

  if (cityLocation) {
    query.location = { $regex: escapeRegex(cityLocation), $options: 'i' };
  }

  if (search) {
    const pattern = { $regex: escapeRegex(search), $options: 'i' };
    query.$or = [{ title: pattern }, { description: pattern }, { skills: pattern }, { companyName: pattern }];
  }

  // Work Mode filter (multi-select OR)
  if (workModes.length > 0) {
    query.workMode = { $in: workModes as IJobs['workMode'][] };
  }

  // Category filter (multi-select OR)
  if (categories.length > 0) {
    query.category = {
      $in: categories.map((c) => new RegExp(`^${escapeRegex(c)}$`, 'i')) as unknown as string[],
    };
  }

  // Employment Type filter (multi-select OR)
  if (employmentTypes.length > 0) {
    query.employmentType = { $in: employmentTypes as IJobs['employmentType'][] };
  }

  // Experience Level filter (multi-select OR)
  if (experienceLevels.length > 0) {
    query.experienceLevel = { $in: experienceLevels as IJobs['experienceLevel'][] };
  }

  // Salary range
  if (salaryMin || salaryMax || salaryDisclosed === 'true') {
    if (salaryDisclosed === 'true') {
      query['salary.min'] = { $exists: true, $ne: null };
    }
    if (salaryMin) {
      query['salary.min'] = { ...(query['salary.min'] || {}), $gte: Number(salaryMin) };
    }
    if (salaryMax) {
      query['salary.max'] = { ...(query['salary.max'] || {}), $lte: Number(salaryMax) };
    }
  }

  // Skills filter
  if (skills.length > 0) {
    query.skills = { $in: skills };
  }

  // Date posted filter
  if (datePostedDays) {
    const date = new Date();
    date.setDate(date.getDate() - datePostedDays);
    query.createdAt = { $gte: date };
  }

  const sortParam = asString(sort) || (sortBy ? `${String(sortBy)}-${String(sortOrder || 'desc')}` : 'newest');
  const sortQuery = buildSortQuery(sortParam);

  const criteria: JobFilterCriteria = {
    search,
    countryCode: countryValue,
    location: cityLocation,
    city: cityLocation,
    workModes: workModes.length > 0 ? workModes : undefined,
    categories: categories.length > 0 ? categories : undefined,
    employmentTypes: employmentTypes.length > 0 ? employmentTypes : undefined,
    experienceLevels: experienceLevels.length > 0 ? experienceLevels : undefined,
    salaryMin: asNumber(salaryMin),
    salaryMax: asNumber(salaryMax),
    salaryDisclosed: salaryDisclosed === 'true',
    skills: skills.length > 0 ? skills : undefined,
    source: sourceValue,
    datePostedDays,
  };

  const shouldFetchExternal = sourceValue !== 'workmark';

  const workmarkQuery = Job.find({ ...query, source: 'workmark' })
    .populate('employerId', 'name email')
    .populate('companyId', 'name logo')
    .sort(sortQuery)
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);

  const [workmarkJobs, workmarkTotal, externalResult] = await Promise.all([
    sourceValue === 'adzuna' ? Promise.resolve([]) : workmarkQuery.exec(),
    sourceValue === 'adzuna' ? Promise.resolve(0) : Job.countDocuments({ ...query, source: 'workmark' }),
    shouldFetchExternal
      ? searchExternalJobs({
          ...criteria,
          page: pageNumber,
          limit: limitNumber,
        })
      : Promise.resolve({ jobs: [], total: 0, failed: false }),
  ]);

  // Save/cache valid external jobs in MongoDB and strictly filter
  const externalJobs: any[] = [];
  for (const externalJob of externalResult.jobs) {
    if (matchesJobFilter(externalJob, criteria)) {
      const storedJob = await Job.findOneAndUpdate(
        { source: 'adzuna', externalId: externalJob.externalId },
        { $set: externalJob },
        { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
      );
      if (storedJob) {
        externalJobs.push(storedJob);
      }
    }
  }

  // Combine and sort
  const combinedJobs = [...workmarkJobs, ...externalJobs];

  // Attach deterministic match score if authenticated
  const jobsWithScore = combinedJobs.map((job) => {
    const rawObj = typeof job.toObject === 'function' ? job.toObject() : { ...job };
    const score = calculateJobMatchScore(rawObj, req.user);
    return {
      ...rawObj,
      matchScore: score > 0 ? score : undefined,
    };
  });

  // Sort
  jobsWithScore.sort((first, second) => {
    if (sortParam === 'recommended' && first.matchScore !== second.matchScore) {
      return (second.matchScore || 0) - (first.matchScore || 0);
    }
    if (sortParam === 'salary_high') {
      return (second.salary?.max || 0) - (first.salary?.max || 0);
    }
    if (sortParam === 'salary_low') {
      return (first.salary?.min || Number.MAX_SAFE_INTEGER) - (second.salary?.min || Number.MAX_SAFE_INTEGER);
    }
    return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();
  });

  const total = workmarkTotal + externalResult.total;

  res.status(200).json({
    success: true,
    data: jobsWithScore.slice(0, limitNumber),
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      pages: Math.ceil(total / limitNumber),
      hasNextPage: pageNumber * limitNumber < total,
      hasPreviousPage: pageNumber > 1,
    },
    ...(externalResult.failed
      ? { message: 'Some external job listings are temporarily unavailable.' }
      : {}),
  });
});

export const getJob = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const job = await Job.findById(id)
    .populate('employerId', 'name email')
    .populate('companyId');

  if (!job) {
    throw new AppError('Job not found', 404);
  }

  job.views += 1;
  await job.save();

  const rawJob = typeof job.toObject === 'function' ? job.toObject() : { ...job };
  let opportunityIntelligence;
  if (req.user) {
    const profile = await Profile.findOne({ userId: req.user._id });
    opportunityIntelligence = calculateOpportunityIntelligence(rawJob, req.user, profile);
  }

  res.status(200).json({
    success: true,
    data: {
      job: {
        ...rawJob,
        matchScore: opportunityIntelligence?.score,
        opportunityIntelligence,
      },
    },
  });
});

export const updateJob = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const job = await Job.findById(id);

  if (!job) {
    throw new AppError('Job not found', 404);
  }

  if (!job.employerId || job.employerId.toString() !== req.user?._id.toString()) {
    throw new AppError('Not authorized to update this job', 403);
  }

  const updateData = { ...req.body };
  if (!updateData.salary && (updateData.salaryMin !== undefined || updateData.salaryMax !== undefined)) {
    updateData.salary = {
      min: updateData.salaryMin ? Number(updateData.salaryMin) : undefined,
      max: updateData.salaryMax ? Number(updateData.salaryMax) : undefined,
      currency: updateData.salaryCurrency || job.salary?.currency || 'USD',
      period: updateData.salaryPeriod === 'year' ? 'yearly' : updateData.salaryPeriod === 'month' ? 'monthly' : (updateData.salaryPeriod || job.salary?.period || 'yearly'),
    };
  } else if (updateData.salary && updateData.salary.period) {
    if (updateData.salary.period === 'year') updateData.salary.period = 'yearly';
    if (updateData.salary.period === 'month') updateData.salary.period = 'monthly';
    if (updateData.salary.period === 'hour') updateData.salary.period = 'hourly';
  }

  const updatedJob = await Job.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Job updated successfully',
    data: { job: updatedJob },
  });
});

export const deleteJob = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const job = await Job.findById(id);

  if (!job) {
    throw new AppError('Job not found', 404);
  }

  if (!job.employerId || job.employerId.toString() !== req.user?._id.toString()) {
    throw new AppError('Not authorized to delete this job', 403);
  }

  await Job.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Job deleted successfully',
  });
});

export const updateJobStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const job = await Job.findById(id);

  if (!job) {
    throw new AppError('Job not found', 404);
  }

  if (!job.employerId || job.employerId.toString() !== req.user?._id.toString()) {
    throw new AppError('Not authorized to update this job', 403);
  }

  job.status = status;
  await job.save();

  res.status(200).json({
    success: true,
    message: 'Job status updated successfully',
    data: { job },
  });
});

export const getEmployerJobs = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, status } = req.query;

  const query: FilterQuery<IJobs> = { employerId: req.user?._id };

  if (status) {
    query.status = status as any;
  }

  const result = await paginate(
    Job,
    query,
    { page: Number(page) || 1, limit: Number(limit) || 10 },
    'companyId',
    { createdAt: -1 }
  );

  // Compute live application counts per stage for each job
  const enhancedJobs = await Promise.all(
    result.data.map(async (job) => {
      const applications = await Application.find({ jobId: job._id });
      
      const stageCounts = {
        pending: 0,
        reviewed: 0,
        shortlisted: 0,
        interview: 0,
        accepted: 0,
        rejected: 0,
      };

      let newApplicationsCount = 0;
      for (const app of applications) {
        if (stageCounts[app.status as keyof typeof stageCounts] !== undefined) {
          stageCounts[app.status as keyof typeof stageCounts]++;
        }
        if (!app.isViewedByEmployer) {
          newApplicationsCount++;
        }
      }

      const rawJob = typeof (job as any).toObject === 'function' ? (job as any).toObject() : { ...job };
      return {
        ...rawJob,
        applicationCount: applications.length,
        newApplicationsCount,
        stageCounts,
      };
    })
  );

  res.status(200).json({
    success: true,
    data: enhancedJobs,
    pagination: result.pagination,
  });
});

export const getFeaturedJobs = asyncHandler(async (req: Request, res: Response) => {
  const { limit } = req.query;

  const jobs = await Job.find({ status: 'active', isFeatured: true })
    .populate('employerId', 'name')
    .populate('companyId', 'name logo')
    .sort({ createdAt: -1 })
    .limit(Number(limit) || 6);

  res.status(200).json({
    success: true,
    data: { jobs },
  });
});
