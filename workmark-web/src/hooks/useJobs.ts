import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as jobsApi from '../api/jobs';
import type { JobFormData, JobSearchParams } from '../types';
import toast from 'react-hot-toast';

export const useJobs = (params?: JobSearchParams) => {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => jobsApi.getJobs(params),
  });
};

export const useJob = (id: string | undefined) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => jobsApi.getJob(id!),
    enabled: !!id,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, unknown>) => jobsApi.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
      toast.success('Job created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create job');
    },
  });
};

export const useUpdateJob = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<JobFormData>) => jobsApi.updateJob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
      toast.success('Job updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update job');
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobsApi.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
      toast.success('Job deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete job');
    },
  });
};

export const useEmployerJobs = (params?: { page?: number; limit?: number; status?: string }) => {
  return useQuery({
    queryKey: ['employer-jobs', params],
    queryFn: () => jobsApi.getEmployerJobs(params),
  });
};

export const useFeaturedJobs = () => {
  return useQuery({
    queryKey: ['featured-jobs'],
    queryFn: () => jobsApi.getFeaturedJobs(),
  });
};

export const useUpdateJobStatus = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: 'active' | 'closed' | 'draft') => jobsApi.updateJobStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
      toast.success('Job status updated!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update job status');
    },
  });
};
