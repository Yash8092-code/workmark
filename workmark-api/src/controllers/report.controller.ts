import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import Report from '../models/Report';
import Job from '../models/Job';

export const createReport = asyncHandler(async (req: Request, res: Response) => {
  const { jobId } = req.params;
  const { reason, description } = req.body;

  const job = await Job.findById(jobId);

  if (!job) {
    throw new AppError('Job not found', 404);
  }

  const report = await Report.create({
    reporterId: req.user?._id,
    jobId,
    reason,
    description,
  });

  res.status(201).json({
    success: true,
    message: 'Report submitted successfully',
    data: { report },
  });
});

export const getReports = asyncHandler(async (req: Request, res: Response) => {
  const reports = await Report.find()
    .populate('reporterId', 'name email')
    .populate('jobId', 'title')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: { reports },
  });
});
