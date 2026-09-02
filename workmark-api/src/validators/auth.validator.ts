import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['job_seeker', 'employer']).optional().default('job_seeker'),
  companyName: z.string().optional(),
  countryCode: z.string().min(2).max(3).toLowerCase().trim().optional(),
  countryName: z.string().trim().optional(),
});

export const updateCountrySchema = z.object({
  countryCode: z.string().min(2).max(3).toLowerCase().trim(),
  countryName: z.string().min(2).trim().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export const verifyEmailSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  otp: z.string().regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
});

export const resendOTPSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
});

export const resetPasswordSchema = z.object({
  token: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const updatePreferencesSchema = z.object({
  emailNotifications: z
    .object({
      newJobs: z.boolean().optional(),
      applicationUpdates: z.boolean().optional(),
      marketing: z.boolean().optional(),
    })
    .optional(),
  jobAlertPreferences: z
    .object({
      keywords: z.array(z.string()).optional(),
      locations: z.array(z.string()).optional(),
      countries: z.array(z.string()).optional(),
      categories: z.array(z.string()).optional(),
      employmentTypes: z.array(z.string()).optional(),
      workModes: z.array(z.string()).optional(),
      experienceLevels: z.array(z.string()).optional(),
    })
    .optional(),
});
