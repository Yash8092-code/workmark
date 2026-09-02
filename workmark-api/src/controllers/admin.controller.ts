import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import User from '../models/User';
import Job from '../models/Job';
import Application from '../models/Application';
import Company from '../models/Company';
import Report from '../models/Report';
import { paginate, buildSearchQuery } from '../utils/helpers';

export const getStats = asyncHandler(async (req: Request, res: Response) => {
  const totalUsers = await User.countDocuments();
  const totalEmployers = await User.countDocuments({ role: 'employer' });
  const totalJobSeekers = await User.countDocuments({ role: 'job_seeker' });
  const totalJobs = await Job.countDocuments();
  const activeJobs = await Job.countDocuments({ status: 'active' });
  const totalApplications = await Application.countDocuments();
  const totalCompanies = await Company.countDocuments();

  const recentUsers = await User.find()
    .select('name email role createdAt')
    .sort({ createdAt: -1 })
    .limit(5);

  const recentJobs = await Job.find()
    .populate('companyId', 'name logo')
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalUsers,
        totalEmployers,
        totalJobSeekers,
        totalJobs,
        activeJobs,
        totalApplications,
        totalCompanies,
      },
      recentUsers,
      recentJobs,
    },
  });
});

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const { search, role, isActive, page, limit } = req.query;

  const query: any = {};

  if (search) {
    const searchQuery = buildSearchQuery(search as string, ['name', 'email']);
    Object.assign(query, searchQuery);
  }

  if (role) {
    query.role = role;
  }

  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  const result = await paginate(
    User,
    query,
    { page: Number(page) || 1, limit: Number(limit) || 10 },
    undefined,
    { createdAt: -1 }
  );

  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

export const updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const user = await User.findById(id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.role === 'admin') {
    throw new AppError('Cannot update admin user status', 403);
  }

  user.isActive = isActive;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User ${isActive ? 'activated' : 'suspended'} successfully`,
    data: { user },
  });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.role === 'admin') {
    throw new AppError('Cannot delete admin user', 403);
  }

  await User.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});

export const getAdminJobs = asyncHandler(async (req: Request, res: Response) => {
  const { status, page, limit } = req.query;

  const query: any = {};

  if (status) {
    query.status = status;
  }

  const result = await paginate(
    Job,
    query,
    { page: Number(page) || 1, limit: Number(limit) || 10 },
    ['employerId', 'companyId'],
    { createdAt: -1 }
  );

  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

export const removeJob = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const job = await Job.findById(id);

  if (!job) {
    throw new AppError('Job not found', 404);
  }

  await Job.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Job removed successfully',
  });
});

export const verifyCompany = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const company = await Company.findById(id);

  if (!company) {
    throw new AppError('Company not found', 404);
  }

  company.verified = true;
  await company.save();

  res.status(200).json({
    success: true,
    message: 'Company verified successfully',
    data: { company },
  });
});

export const getReports = asyncHandler(async (req: Request, res: Response) => {
  const { status, page, limit } = req.query;

  const query: any = {};

  if (status) {
    query.status = status;
  }

  const result = await paginate(
    Report,
    query,
    { page: Number(page) || 1, limit: Number(limit) || 10 },
    ['reporterId', 'jobId'],
    { createdAt: -1 }
  );

  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

export const reviewReport = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, removeJob } = req.body;

  const report = await Report.findById(id);

  if (!report) {
    throw new AppError('Report not found', 404);
  }

  report.status = status;
  report.reviewedBy = req.user?._id;
  report.reviewedAt = new Date();
  await report.save();

  if (removeJob && status === 'resolved') {
    await Job.findByIdAndDelete(report.jobId);
  }

  res.status(200).json({
    success: true,
    message: 'Report reviewed successfully',
    data: { report },
  });
});
