import apiClient from './client';
import type { Profile, ProfileFormData } from '../types';

const normalizeProfile = (profile: Profile & { resumeUrl?: string }): Profile => ({
  ...profile,
  skills: profile.skills ?? [],
  experience: profile.experience ?? [],
  education: profile.education ?? [],
  projects: profile.projects ?? [],
  socialLinks: profile.socialLinks ?? {},
  resume: profile.resume ?? profile.resumeUrl,
});

export const getProfile = async (userId?: string): Promise<Profile> => {
  if (!userId) {
    throw new Error('User ID is required to load a profile');
  }
  const response = await apiClient.get<{ success: boolean; data: { profile: Profile } }>(`/profile/${userId}`);
  return normalizeProfile(response.data.data.profile);
};

export const updateProfile = async (data: ProfileFormData): Promise<Profile> => {
  const response = await apiClient.put<{ success: boolean; data: { profile: Profile } }>('/profile', data);
  return normalizeProfile(response.data.data.profile);
};

export const uploadResume = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await apiClient.post<{ success: boolean; data: { resumeUrl: string } }>(
    '/profile/resume',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return { url: response.data.data.resumeUrl };
};

export const uploadAvatar = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await apiClient.post<{ success: boolean; data: { avatar: string } }>(
    '/profile/avatar',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return { url: response.data.data.avatar };
};
