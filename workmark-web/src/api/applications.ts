import apiClient from './client';
import type { Application, ApplicationStatus, PaginatedResponse } from '../types';

export const applyToJob = async (jobId: string, data: { coverLetter?: string; resumeUrl?: string }): Promise<Application> => {
  const response = await apiClient.post<{ success: boolean; data: { application: Application } }>(`/applications/${jobId}`, data);
  return response.data.data.application;
};

export const getMyApplications = async (params?: {
  page?: number;
  limit?: number;
  status?: ApplicationStatus;
}): Promise<PaginatedResponse<Application>> => {
  const response = await apiClient.get<PaginatedResponse<Application>>('/applications/my-applications', { params });
  return response.data;
};

export const getJobApplications = async (jobId: string, params?: {
  page?: number;
  limit?: number;
  status?: ApplicationStatus;
}): Promise<PaginatedResponse<Application>> => {
  const response = await apiClient.get<PaginatedResponse<Application>>(`/applications/job/${jobId}`, { params });
  return response.data;
};

export const getApplication = async (id: string): Promise<Application> => {
  const response = await apiClient.get<{ success: boolean; data: { application: Application } }>(`/applications/${id}`);
  return response.data.data.application;
};

export const updateApplicationStatus = async (id: string, status: ApplicationStatus, note?: string): Promise<Application> => {
  const response = await apiClient.patch<{ success: boolean; data: { application: Application } }>(`/applications/${id}/status`, { status, note });
  return response.data.data.application;
};
