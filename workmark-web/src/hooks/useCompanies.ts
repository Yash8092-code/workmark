import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as companiesApi from '../api/companies';
import type { CompanyFormData } from '../types';
import toast from 'react-hot-toast';

export const useCompanies = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  industry?: string;
}) => {
  return useQuery({
    queryKey: ['companies', params],
    queryFn: () => companiesApi.getCompanies(params),
  });
};

export const useCompany = (id: string | undefined) => {
  return useQuery({
    queryKey: ['company', id],
    queryFn: () => companiesApi.getCompany(id!),
    enabled: !!id,
  });
};

export const useMyCompany = () => {
  return useQuery({
    queryKey: ['my-company'],
    queryFn: companiesApi.getMyCompany,
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompanyFormData) => companiesApi.createCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Company created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create company');
    },
  });
};

export const useUpdateCompany = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CompanyFormData>) => companiesApi.updateCompany(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company', id] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Company updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update company');
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => companiesApi.deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Company deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete company');
    },
  });
};
