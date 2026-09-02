import apiClient from './client';
import type { Notification, PaginatedResponse } from '../types';

export const getNotifications = async (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Notification>> => {
  const response = await apiClient.get<PaginatedResponse<Notification>>('/notifications', { params });
  return response.data;
};

export const markAsRead = async (id: string): Promise<void> => {
  await apiClient.patch(`/notifications/${id}/read`);
};

export const markAllAsRead = async (): Promise<void> => {
  await apiClient.patch('/notifications/read-all');
};

export const getUnreadCount = async (): Promise<number> => {
  const response = await apiClient.get<{ success: boolean; data: { count: number } }>('/notifications/unread-count');
  return response.data.data.count;
};
