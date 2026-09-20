import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters').trim(),
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  mobileNumber: z.string().min(6, 'Mobile number is required (at least 6 digits)').trim(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_.-]+$/, 'Username can only contain alphanumeric characters, underscores, dots, and hyphens')
    .toLowerCase()
    .trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().optional(),
  role: z.enum(['job_seeker', 'employer']).optional().default('job_seeker'),
  companyName: z.string().optional(),
  countryCode: z.string().min(2, 'Target country is required').trim(),
  countryName: z.string().trim().optional(),
  domains: z.array(z.string().trim()).optional().default([]),
});

export const updateCountrySchema = z.object({
  countryCode: z.string().min(2).max(3).toLowerCase().trim(),
  countryName: z.string().min(2).trim().optional(),
});

export const loginSchema = z
  .object({
    identifier: z.string().trim().optional(),
    email: z.string().trim().optional(),
    username: z.string().trim().optional(),
    password: z.string().min(1, 'Password is required'),
  })
  .refine((data) => !!(data.identifier || data.email || data.username), {
    message: 'Username or email is required',
    path: ['identifier'],
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
