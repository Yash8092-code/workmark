import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import Notification from '../models/Notification';
import { paginate } from '../utils/helpers';

export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = req.query;

  const result = await paginate(
    Notification,
    { userId: req.user?._id },
    { page: Number(page) || 1, limit: Number(limit) || 20 },
    undefined,
    { createdAt: -1 }
  );

  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const notification = await Notification.findById(id);

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  if (notification.userId.toString() !== req.user?._id.toString()) {
    throw new AppError('Not authorized to update this notification', 403);
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
  });
});

export const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  await Notification.updateMany(
    { userId: req.user?._id, isRead: false },
    { isRead: true }
  );

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read',
  });
});

export const getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
  const count = await Notification.countDocuments({
    userId: req.user?._id,
    isRead: false,
  });

  res.status(200).json({
    success: true,
    data: { count },
  });
});
