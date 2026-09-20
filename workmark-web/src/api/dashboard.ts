import apiClient from './client';
import type { SeekerDashboardResponse, EmployerDashboardResponse } from '../types';

export const dashboardApi = {
  getSeekerDashboard: async (): Promise<SeekerDashboardResponse> => {
    const response = await apiClient.get<{ success: boolean; data: SeekerDashboardResponse }>('/dashboard/seeker');
    return response.data.data;
  },

  getEmployerDashboard: async (): Promise<EmployerDashboardResponse> => {
    const response = await apiClient.get<{ success: boolean; data: EmployerDashboardResponse }>('/dashboard/employer');
    return response.data.data;
  },
};
