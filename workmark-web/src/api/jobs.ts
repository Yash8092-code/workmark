import apiClient from './client';
import type { Job, JobFormData, JobSearchParams, PaginatedResponse } from '../types';

export const getJobs = async (params?: JobSearchParams): Promise<PaginatedResponse<Job>> => {
  const response = await apiClient.get<PaginatedResponse<Job>>('/jobs', { params });
  return response.data;
};

export const getJob = async (id: string): Promise<Job> => {
  const response = await apiClient.get<{ success: boolean; data: { job: Job } }>(`/jobs/${id}`);
  return response.data.data.job;
};

export const createJob = async (data: Record<string, unknown>): Promise<Job> => {
  const response = await apiClient.post<{ success: boolean; data: { job: Job } }>('/jobs', data);
  return response.data.data.job;
};

export const updateJob = async (id: string, data: Partial<JobFormData>): Promise<Job> => {
  const response = await apiClient.put<{ success: boolean; data: { job: Job } }>(`/jobs/${id}`, data);
  return response.data.data.job;
};

export const deleteJob = async (id: string): Promise<void> => {
  await apiClient.delete(`/jobs/${id}`);
};

export const updateJobStatus = async (id: string, status: 'active' | 'closed' | 'draft'): Promise<Job> => {
  const response = await apiClient.patch<{ success: boolean; data: { job: Job } }>(`/jobs/${id}/status`, { status });
  return response.data.data.job;
};

export const getEmployerJobs = async (params?: { page?: number; limit?: number; status?: string }): Promise<PaginatedResponse<Job>> => {
  const response = await apiClient.get<PaginatedResponse<Job>>('/jobs/employer/my-jobs', { params });
  return response.data;
};

export const getFeaturedJobs = async (): Promise<Job[]> => {
  const response = await apiClient.get<{ success: boolean; data: { jobs: Job[] } }>('/jobs/featured');
  return response.data.data.jobs;
};

export const searchJobs = async (params: JobSearchParams): Promise<PaginatedResponse<Job>> => {
  const response = await apiClient.get<PaginatedResponse<Job>>('/jobs/search', { params });
  return response.data;
};
