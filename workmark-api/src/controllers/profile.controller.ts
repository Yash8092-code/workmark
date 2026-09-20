import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import Profile from '../models/Profile';
import User from '../models/User';
import { uploadToCloudinary } from '../middleware/upload';

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  let profile = await Profile.findOne({ userId }).populate('userId', 'name email avatar role');

  if (!profile) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    profile = await Profile.create({ userId });
    profile = await Profile.findById(profile._id).populate('userId', 'name email avatar role');
  }

  res.status(200).json({
    success: true,
    data: { profile },
  });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const sanitizeDates = (items: any[]) => {
    if (!Array.isArray(items)) return items;
    return items.map((item) => {
      const copy = { ...item };
      if (copy.startDate === '' || copy.startDate === null) delete copy.startDate;
      if (copy.endDate === '' || copy.endDate === null) delete copy.endDate;
      return copy;
    });
  };

  const updateData = { ...req.body };
  if (updateData.experience) {
    updateData.experience = sanitizeDates(updateData.experience);
  }
  if (updateData.education) {
    updateData.education = sanitizeDates(updateData.education);
  }
  if (updateData.projects) {
    updateData.projects = sanitizeDates(updateData.projects);
  }

  // If user name or phone is passed, update User document as well
  if (req.body.name || req.body.phone) {
    await User.findByIdAndUpdate(userId, {
      ...(req.body.name ? { name: req.body.name } : {}),
      ...(req.body.phone ? { phone: req.body.phone } : {}),
    });
  }

  const profile = await Profile.findOneAndUpdate(
    { userId },
    { $set: updateData },
    { new: true, upsert: true, runValidators: true }
  ).populate('userId', 'name email avatar role');

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

  const resumeUrl = await uploadToCloudinary(req.file, 'workmark/resumes', 'auto');

  const profile = await Profile.findOneAndUpdate(
    { userId: req.user?._id },
    { resumeUrl },
    { new: true, upsert: true }
  );

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
