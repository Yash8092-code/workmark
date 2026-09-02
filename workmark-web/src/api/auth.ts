import apiClient from './client';
import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
  VerifyEmailInput,
  ResendOTPInput,
  User,
} from '../types';

export const register = async (data: RegisterInput): Promise<AuthResponse> => {
  const response = await apiClient.post<{ data: AuthResponse; message?: string }>('/auth/register', data);
  return response.data.data;
};

export const verifyEmail = async (data: VerifyEmailInput): Promise<AuthResponse> => {
  const response = await apiClient.post<{ data: AuthResponse; message?: string }>('/auth/verify-email', data);
  return response.data.data;
};

export const resendOTP = async (data: ResendOTPInput): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>('/auth/resend-otp', data);
  return response.data;
};

export const login = async (data: LoginInput): Promise<AuthResponse> => {
  const response = await apiClient.post<{ data: AuthResponse }>('/auth/login', data);
  return response.data.data;
};

export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};

export const getMe = async (): Promise<User> => {
  const response = await apiClient.get<{ data: { user: User } }>('/auth/me');
  return response.data.data.user;
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token: string, password: string): Promise<{ message: string; data?: { token: string; user: User } }> => {
  const response = await apiClient.post<{ message: string; data?: { token: string; user: User } }>('/auth/reset-password', { token, password });
  return response.data;
};

export const getPreferences = async (): Promise<{ emailNotifications: any; jobAlertPreferences: any }> => {
  const response = await apiClient.get<{ data: { emailNotifications: any; jobAlertPreferences: any } }>('/auth/preferences');
  return response.data.data;
};

export const updatePreferences = async (data: { emailNotifications?: any; jobAlertPreferences?: any }): Promise<{ message: string; data: any }> => {
  const response = await apiClient.put<{ message: string; data: any }>('/auth/preferences', data);
  return response.data;
};

export const updateCountry = async (data: { countryCode: string; countryName?: string }): Promise<{ message: string; data: { user: User } }> => {
  const response = await apiClient.put<{ message: string; data: { user: User } }>('/auth/country', data);
  return response.data;
};
