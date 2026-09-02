import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as profilesApi from '../api/profiles';
import type { ProfileFormData } from '../types';
import toast from 'react-hot-toast';
import { useAuth } from './useAuth';

export const useProfile = (userId?: string) => {
  const { user } = useAuth();
  const profileUserId = userId || user?._id;

  return useQuery({
    queryKey: ['profile', profileUserId],
    queryFn: () => profilesApi.getProfile(profileUserId),
    enabled: !!profileUserId,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProfileFormData) => profilesApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
};

export const useUploadResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => profilesApi.uploadResume(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Resume uploaded successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload resume');
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => profilesApi.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Avatar updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload avatar');
    },
  });
};
