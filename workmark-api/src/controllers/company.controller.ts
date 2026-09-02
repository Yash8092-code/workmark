import { Request, Response } from 'express';
import slugify from 'slugify';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import Company from '../models/Company';
import Job from '../models/Job';
import { paginate, buildSearchQuery } from '../utils/helpers';
import { uploadToCloudinary } from '../middleware/upload';

export const createCompany = asyncHandler(async (req: Request, res: Response) => {
  if (req.user?.role !== 'employer') {
    throw new AppError('Only employers can create companies', 403);
  }

  const { name } = req.body;

  let slug = slugify(name, { lower: true, strict: true });

  const existingCompany = await Company.findOne({ slug });
  if (existingCompany) {
    slug = `${slug}-${Date.now()}`;
  }

  const company = await Company.create({
    ...req.body,
    ownerId: req.user._id,
    slug,
  });

  res.status(201).json({
    success: true,
    message: 'Company created successfully',
    data: { company },
  });
});

export const getCompanies = asyncHandler(async (req: Request, res: Response) => {
  const { search, page, limit } = req.query;

  const query = search ? buildSearchQuery(search as string, ['name', 'description', 'industry']) : {};

  const result = await paginate(
    Company,
    query,
    { page: Number(page) || 1, limit: Number(limit) || 10 },
    'ownerId',
    { createdAt: -1 }
  );

  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

export const getMyCompany = asyncHandler(async (req: Request, res: Response) => {
  const company = await Company.findOne({ ownerId: req.user?._id });

  if (!company) {
    throw new AppError('Create a company profile before posting a job', 404);
  }

  res.status(200).json({ success: true, data: { company } });
});

export const getCompany = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const company = await Company.findById(id).populate('ownerId', 'name email');

  if (!company) {
    throw new AppError('Company not found', 404);
  }

  const jobsCount = await Job.countDocuments({ companyId: company._id, status: 'active' });

  res.status(200).json({
    success: true,
    data: {
      company,
      jobsCount,
    },
  });
});

export const updateCompany = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const company = await Company.findById(id);

  if (!company) {
    throw new AppError('Company not found', 404);
  }

  if (company.ownerId.toString() !== req.user?._id.toString()) {
    throw new AppError('Not authorized to update this company', 403);
  }

  const updatedCompany = await Company.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Company updated successfully',
    data: { company: updatedCompany },
  });
});

export const deleteCompany = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const company = await Company.findById(id);

  if (!company) {
    throw new AppError('Company not found', 404);
  }

  if (company.ownerId.toString() !== req.user?._id.toString()) {
    throw new AppError('Not authorized to delete this company', 403);
  }

  await Job.deleteMany({ companyId: company._id });
  await Company.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Company deleted successfully',
  });
});

export const uploadLogo = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const company = await Company.findById(id);

  if (!company) {
    throw new AppError('Company not found', 404);
  }

  if (company.ownerId.toString() !== req.user?._id.toString()) {
    throw new AppError('Not authorized to update this company', 403);
  }

  if (!req.file) {
    throw new AppError('No file uploaded', 400);
  }

  const logoUrl = await uploadToCloudinary(req.file, 'workmark/companies/logos');

  company.logo = logoUrl;
  await company.save();

  res.status(200).json({
    success: true,
    message: 'Logo uploaded successfully',
    data: { logo: logoUrl },
  });
});

export const uploadCover = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const company = await Company.findById(id);

  if (!company) {
    throw new AppError('Company not found', 404);
  }

  if (company.ownerId.toString() !== req.user?._id.toString()) {
    throw new AppError('Not authorized to update this company', 403);
  }

  if (!req.file) {
    throw new AppError('No file uploaded', 400);
  }

  const coverUrl = await uploadToCloudinary(req.file, 'workmark/companies/covers');

  company.coverImage = coverUrl;
  await company.save();

  res.status(200).json({
    success: true,
    message: 'Cover image uploaded successfully',
    data: { coverImage: coverUrl },
  });
});
