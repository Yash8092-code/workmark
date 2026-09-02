import apiClient from './client';
import type { Company, CompanyFormData, PaginatedResponse } from '../types';

export const createCompany = async (data: CompanyFormData): Promise<Company> => {
  const response = await apiClient.post<{ success: boolean; data: { company: Company } }>('/companies', data);
  return response.data.data.company;
};

export const getCompanies = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  industry?: string;
}): Promise<PaginatedResponse<Company>> => {
  const response = await apiClient.get<PaginatedResponse<Company>>('/companies', { params });
  return response.data;
};

export const getCompany = async (id: string): Promise<Company> => {
  const response = await apiClient.get<{ success: boolean; data: { company: Company } }>(`/companies/${id}`);
  return response.data.data.company;
};

export const getMyCompany = async (): Promise<Company> => {
  const response = await apiClient.get<{ success: boolean; data: { company: Company } }>('/companies/mine');
  return response.data.data.company;
};

export const updateCompany = async (id: string, data: Partial<CompanyFormData>): Promise<Company> => {
  const response = await apiClient.put<{ success: boolean; data: { company: Company } }>(`/companies/${id}`, data);
  return response.data.data.company;
};

export const deleteCompany = async (id: string): Promise<void> => {
  await apiClient.delete(`/companies/${id}`);
};

export const uploadLogo = async (id: string, file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('logo', file);

  const response = await apiClient.post<{ success: boolean; data: { logo: string } }>(
    `/companies/${id}/logo`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return { url: response.data.data.logo };
};

export const uploadCover = async (id: string, file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('cover', file);

  const response = await apiClient.post<{ success: boolean; data: { coverImage: string } }>(
    `/companies/${id}/cover`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return { url: response.data.data.coverImage };
};
