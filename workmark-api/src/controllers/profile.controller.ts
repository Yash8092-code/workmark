import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import Profile from '../models/Profile';
import User from '../models/User';
import { uploadToCloudinary } from '../middleware/upload';

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const profile = await Profile.findOne({ userId }).populate('userId', 'name email avatar role');

  if (!profile) {
    throw new AppError('Profile not found', 404);
  }

  res.status(200).json({
    success: true,
    data: { profile },
  });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const profile = await Profile.findOneAndUpdate(
    { userId },
    { $set: req.body },
    { new: true, runValidators: true }
  ).populate('userId', 'name email avatar role');

  if (!profile) {
    throw new AppError('Profile not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: { profile },
  });
});

export const uploadResume = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError('No file uploaded', 400);
  }

  const resumeUrl = await uploadToCloudinary(req.file, 'workmark/resumes');

  const profile = await Profile.findOneAndUpdate(
    { userId: req.user?._id },
    { resumeUrl },
    { new: true }
  );

  if (!profile) {
    throw new AppError('Profile not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Resume uploaded successfully',
    data: { resumeUrl },
  });
});

export const uploadAvatar = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError('No file uploaded', 400);
  }

  const avatarUrl = await uploadToCloudinary(req.file, 'workmark/avatars');

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { avatar: avatarUrl },
    { new: true }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Avatar uploaded successfully',
    data: { avatar: avatarUrl },
  });
});
