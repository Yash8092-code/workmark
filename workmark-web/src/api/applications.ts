import apiClient from './client';
import type { Application, ApplicationStatus, PaginatedResponse, Profile, OpportunityExplanation } from '../types';

export interface ApplicationDetailsResponse {
  application: Application;
  profile?: Profile;
  matchScore?: number;
  opportunityIntelligence?: OpportunityExplanation;
}

export interface UpdateStatusPayload {
  status?: ApplicationStatus;
  note?: string;
  interviewAction?: 'schedule' | 'reschedule' | 'cancel';
  interviewDate?: string;
  interviewTime?: string;
  interviewMode?: 'video' | 'phone' | 'onsite';
  interviewLocation?: string;
  interviewMessage?: string;
  cancelledReason?: string;
}

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

export const getApplication = async (id: string): Promise<ApplicationDetailsResponse> => {
  const response = await apiClient.get<{
    success: boolean;
    data: {
      application: Application;
      profile?: Profile;
      matchScore?: number;
      opportunityIntelligence?: OpportunityExplanation;
    };
  }>(`/applications/${id}`);
  return response.data.data;
};

export const updateApplicationStatus = async (
  id: string,
  payload: UpdateStatusPayload | ApplicationStatus,
  note?: string
): Promise<Application> => {
  const data = typeof payload === 'string' ? { status: payload, note } : payload;
  const response = await apiClient.patch<{ success: boolean; data: { application: Application } }>(`/applications/${id}/status`, data);
  return response.data.data.application;
};
