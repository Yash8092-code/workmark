import apiClient from './client';
import type { Profile, ProfileFormData } from '../types';

const normalizeProfile = (profile: Profile & { resumeUrl?: string; avatar?: string }): Profile => ({
  ...profile,
  skills: profile.skills ?? [],
  experience: (profile.experience ?? []).map((exp: any) => ({
    ...exp,
    title: exp.title || exp.position || '',
    company: exp.company || '',
    location: exp.location || '',
    startDate: exp.startDate ? String(exp.startDate).substring(0, 10) : '',
    endDate: exp.endDate ? String(exp.endDate).substring(0, 10) : undefined,
    current: !!exp.current,
    description: exp.description || '',
  })),
  education: (profile.education ?? []).map((edu: any) => ({
    ...edu,
    degree: edu.degree || '',
    institution: edu.institution || edu.school || '',
    fieldOfStudy: edu.fieldOfStudy || edu.field || '',
    startDate: edu.startDate ? String(edu.startDate).substring(0, 10) : '',
    endDate: edu.endDate ? String(edu.endDate).substring(0, 10) : undefined,
    current: !!edu.current,
    description: edu.description || '',
  })),
  projects: (profile.projects ?? []).map((proj: any) => ({
    ...proj,
    title: proj.title || '',
    description: proj.description || '',
    url: proj.url || proj.link || '',
    technologies: proj.technologies ?? [],
    startDate: proj.startDate ? String(proj.startDate).substring(0, 10) : undefined,
    endDate: proj.endDate ? String(proj.endDate).substring(0, 10) : undefined,
  })),
  socialLinks: profile.socialLinks ?? {},
  resume: profile.resume ?? profile.resumeUrl,
  avatar: profile.avatar || (profile.userId as any)?.avatar,
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
