import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import SavedJob from '../models/SavedJob';
import Job from '../models/Job';
import { paginate } from '../utils/helpers';

export const saveJob = asyncHandler(async (req: Request, res: Response) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId);

  if (!job) {
    throw new AppError('Job not found', 404);
  }

  const existingSavedJob = await SavedJob.findOne({
    userId: req.user?._id,
    jobId,
  });

  if (existingSavedJob) {
    await SavedJob.findByIdAndDelete(existingSavedJob._id);

    return res.status(200).json({
      success: true,
      message: 'Job unsaved successfully',
    });
  }

  await SavedJob.create({
    userId: req.user?._id,
    jobId,
  });

  res.status(201).json({
    success: true,
    message: 'Job saved successfully',
  });
});

export const getSavedJobs = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = req.query;

  const result = await paginate(
    SavedJob,
    { userId: req.user?._id },
    { page: Number(page) || 1, limit: Number(limit) || 10 },
    'jobId',
    { createdAt: -1 }
  );

  for (const savedJob of result.data) {
    await savedJob.populate({
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

export const unsaveJob = asyncHandler(async (req: Request, res: Response) => {
  const { jobId } = req.params;

  const savedJob = await SavedJob.findOne({
    userId: req.user?._id,
    jobId,
  });

  if (!savedJob) {
    throw new AppError('Saved job not found', 404);
  }

  await SavedJob.findByIdAndDelete(savedJob._id);

  res.status(200).json({
    success: true,
    message: 'Job unsaved successfully',
  });
});
