import apiClient from './client';
import type { SavedJob, PaginatedResponse } from '../types';

export const saveJob = async (jobId: string): Promise<SavedJob> => {
  const response = await apiClient.post<{ success: boolean; data: SavedJob }>(`/saved-jobs/${jobId}`);
  return response.data.data;
};

export const unsaveJob = async (jobId: string): Promise<void> => {
  await apiClient.delete(`/saved-jobs/${jobId}`);
};

export const getSavedJobs = async (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<SavedJob>> => {
  const response = await apiClient.get<PaginatedResponse<SavedJob>>('/saved-jobs', { params });
  return response.data;
};

export const checkIfSaved = async (jobId: string): Promise<boolean> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: { saved: boolean } }>(`/saved-jobs/check/${jobId}`);
    return response.data.data.saved;
  } catch {
    return false;
  }
};
