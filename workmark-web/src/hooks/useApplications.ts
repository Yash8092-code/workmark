import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as applicationsApi from '../api/applications';
import type { ApplicationStatus } from '../types';
import toast from 'react-hot-toast';

export const useApply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: string; data: { coverLetter?: string; resumeUrl?: string } }) =>
      applicationsApi.applyToJob(jobId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
      toast.success('Application submitted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit application');
    },
  });
};

export const useMyApplications = (params?: {
  page?: number;
  limit?: number;
  status?: ApplicationStatus;
}) => {
  return useQuery({
    queryKey: ['my-applications', params],
    queryFn: () => applicationsApi.getMyApplications(params),
  });
};

export const useJobApplications = (
  jobId: string | undefined,
  params?: {
    page?: number;
    limit?: number;
    status?: ApplicationStatus;
  }
) => {
  return useQuery({
    queryKey: ['job-applications', jobId, params],
    queryFn: () => applicationsApi.getJobApplications(jobId!, params),
    enabled: !!jobId,
  });
};

export const useApplication = (id: string | undefined) => {
  return useQuery({
    queryKey: ['application', id],
    queryFn: () => applicationsApi.getApplication(id!),
    enabled: !!id,
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: ApplicationStatus; note?: string }) =>
      applicationsApi.updateApplicationStatus(id, status, note),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['application', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['job-applications'] });
      toast.success('Application status updated!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update application status');
    },
  });
};
