import { z } from 'zod';

const periodEnum = z.enum(['hourly', 'monthly', 'yearly', 'hour', 'month', 'year']).transform((val) => {
  if (val === 'year') return 'yearly';
  if (val === 'month') return 'monthly';
  if (val === 'hour') return 'hourly';
  return val as 'hourly' | 'monthly' | 'yearly';
});

const workModeEnum = z.enum(['remote', 'onsite', 'hybrid', 'Remote', 'On-site', 'Hybrid', 'unknown']).transform((val) => {
  const lower = val.toLowerCase().replace('-', '');
  if (lower === 'onsite') return 'onsite';
  if (lower === 'hybrid') return 'hybrid';
  if (lower === 'remote') return 'remote';
  return 'remote';
});

const employmentTypeEnum = z.enum([
  'full-time', 'part-time', 'contract', 'internship', 'freelance',
  'Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance'
]).transform((val) => {
  const lower = val.toLowerCase().replace(' ', '-');
  return lower as 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
});

const experienceLevelEnum = z.enum([
  'entry', 'mid', 'senior', 'lead',
  'Fresher', 'Entry Level', '1-3 Years', '3-5 Years', '5+ Years'
]).transform((val) => {
  if (val === 'Fresher' || val === 'Entry Level') return 'entry';
  if (val === '1-3 Years') return 'mid';
  if (val === '3-5 Years') return 'senior';
  if (val === '5+ Years') return 'lead';
  return val.toLowerCase() as 'entry' | 'mid' | 'senior' | 'lead';
});

export const createJobSchema = z.object({
  companyId: z.string().min(1, 'Company ID is required'),
  title: z.string().min(3, 'Job title must be at least 3 characters').trim(),
  description: z.string().min(30, 'Job description must be at least 30 characters'),
  category: z.string().min(1, 'Job category is required').trim(),
  responsibilities: z.array(z.string()).optional().default([]),
  requirements: z.array(z.string()).optional().default([]),
  skills: z.array(z.string()).optional().default([]),
  location: z.string().min(1, 'Job location is required').trim(),
  workMode: workModeEnum,
  employmentType: employmentTypeEnum,
  experienceLevel: experienceLevelEnum,
  salary: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
    currency: z.string().optional().default('USD'),
    period: periodEnum.optional().default('yearly'),
  }).optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  salaryCurrency: z.string().optional(),
  salaryPeriod: z.string().optional(),
  benefits: z.array(z.string()).optional().default([]),
  openings: z.number().int().min(1).optional().default(1),
  deadline: z.string().or(z.date()).optional(),
  status: z.enum(['draft', 'active']).optional().default('active'),
});

export const updateJobSchema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters').trim().optional(),
  description: z.string().min(30, 'Job description must be at least 30 characters').optional(),
  category: z.string().min(1, 'Job category is required').trim().optional(),
  responsibilities: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  location: z.string().min(1, 'Job location is required').trim().optional(),
  workMode: workModeEnum.optional(),
  employmentType: employmentTypeEnum.optional(),
  experienceLevel: experienceLevelEnum.optional(),
  salary: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
    currency: z.string().optional(),
    period: periodEnum.optional(),
  }).optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  salaryCurrency: z.string().optional(),
  salaryPeriod: z.string().optional(),
  benefits: z.array(z.string()).optional(),
  openings: z.number().int().min(1).optional(),
  deadline: z.string().or(z.date()).optional(),
});

export const jobQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  workMode: z.enum(['remote', 'onsite', 'hybrid']).optional(),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'internship']).optional(),
  experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead']).optional(),
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  skills: z.string().optional(),
  datePosted: z.enum(['24h', '7d', '30d']).optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.string().optional(),
});
