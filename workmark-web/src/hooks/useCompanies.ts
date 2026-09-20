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
    retry: false,
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompanyFormData) => companiesApi.createCompany(data),
    onSuccess: (createdCompany) => {
      queryClient.invalidateQueries({ queryKey: ['my-company'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      if (createdCompany?._id) {
        queryClient.invalidateQueries({ queryKey: ['company', createdCompany._id] });
      }
      toast.success('Company created successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to create company');
    },
  });
};

export const useUpdateCompany = (defaultId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { id?: string; data: Partial<CompanyFormData> } | Partial<CompanyFormData>) => {
      let targetId: string;
      let payload: Partial<CompanyFormData>;

      if (variables && 'data' in variables && typeof (variables as any).id === 'string') {
        targetId = (variables as any).id;
        payload = (variables as any).data;
      } else {
        targetId = defaultId || '';
        payload = variables as Partial<CompanyFormData>;
      }

      if (!targetId) {
        throw new Error('Company ID is required to update company profile');
      }

      return companiesApi.updateCompany(targetId, payload);
    },
    onSuccess: (updatedCompany, variables) => {
      const activeId = (variables && 'id' in variables && (variables as any).id) || defaultId || updatedCompany?._id;
      if (activeId) {
        queryClient.invalidateQueries({ queryKey: ['company', activeId] });
      }
      queryClient.invalidateQueries({ queryKey: ['my-company'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Company updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to update company');
    },
  });
};

export const useUploadCompanyLogo = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => companiesApi.uploadLogo(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company', id] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['my-company'] });
      toast.success('Company logo uploaded successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload logo');
    },
  });
};

export const useUploadCompanyCover = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => companiesApi.uploadCover(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company', id] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['my-company'] });
      toast.success('Company cover uploaded successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload cover image');
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
