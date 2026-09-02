import apiClient from './client';
import type { AdminStats, User, Job, Company, Report, PaginatedResponse } from '../types';

export const getStats = async (): Promise<AdminStats> => {
  const response = await apiClient.get<{ success: boolean; data: AdminStats }>('/admin/stats');
  return response.data.data;
};

export const getUsers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}): Promise<PaginatedResponse<User>> => {
  const response = await apiClient.get<PaginatedResponse<User>>('/admin/users', { params });
  return response.data;
};

export const updateUserStatus = async (userId: string, status: 'active' | 'inactive' | 'suspended'): Promise<User> => {
  const response = await apiClient.patch<{ success: boolean; data: User }>(`/admin/users/${userId}/status`, { status });
  return response.data.data;
};

export const deleteUser = async (userId: string): Promise<void> => {
  await apiClient.delete(`/admin/users/${userId}`);
};

export const getAdminJobs = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<PaginatedResponse<Job>> => {
  const response = await apiClient.get<PaginatedResponse<Job>>('/admin/jobs', { params });
  return response.data;
};

export const removeJob = async (jobId: string): Promise<void> => {
  await apiClient.delete(`/admin/jobs/${jobId}`);
};

export const verifyCompany = async (companyId: string): Promise<Company> => {
  const response = await apiClient.patch<{ success: boolean; data: Company }>(`/admin/companies/${companyId}/verify`);
  return response.data.data;
};

export const getReports = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<PaginatedResponse<Report>> => {
  const response = await apiClient.get<PaginatedResponse<Report>>('/admin/reports', { params });
  return response.data;
};

export const reviewReport = async (reportId: string, action: 'reviewed' | 'dismissed', notes?: string): Promise<Report> => {
  const response = await apiClient.patch<{ success: boolean; data: Report }>(`/admin/reports/${reportId}`, {
    status: action,
    reviewNotes: notes
  });
  return response.data.data;
};
