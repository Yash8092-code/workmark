import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as savedJobsApi from '../api/savedJobs';
import toast from 'react-hot-toast';

export const useSavedJobs = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['saved-jobs', params],
    queryFn: () => savedJobsApi.getSavedJobs(params),
  });
};

export const useSaveJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => savedJobsApi.saveJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] });
      toast.success('Job saved!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save job');
    },
  });
};

export const useUnsaveJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => savedJobsApi.unsaveJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] });
      toast.success('Job removed from saved');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove job');
    },
  });
};
