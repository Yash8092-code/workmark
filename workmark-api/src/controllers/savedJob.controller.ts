import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import SavedJob from '../models/SavedJob';
import Job from '../models/Job';
import { paginate } from '../utils/helpers';

import mongoose from 'mongoose';

export const saveJob = asyncHandler(async (req: Request, res: Response) => {
  const { jobId } = req.params;

  const job = mongoose.isValidObjectId(jobId)
    ? await Job.findById(jobId)
    : await Job.findOne({ externalId: jobId });

  if (!job) {
    throw new AppError('Job not found', 404);
  }

  const existingSavedJob = await SavedJob.findOne({
    userId: req.user?._id,
    jobId: job._id,
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
    jobId: job._id,
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

  const job = mongoose.isValidObjectId(jobId)
    ? await Job.findById(jobId)
    : await Job.findOne({ externalId: jobId });

  const targetJobId = job ? job._id : jobId;

  const savedJob = await SavedJob.findOne({
    userId: req.user?._id,
    jobId: targetJobId,
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
