import { z } from 'zod';

export const createJobSchema = z.object({
  companyId: z.string().min(1, 'Company ID is required'),
  title: z.string().min(3, 'Job title must be at least 3 characters').trim(),
  description: z.string().min(50, 'Job description must be at least 50 characters'),
  category: z.string().min(1, 'Job category is required').trim(),
  responsibilities: z.array(z.string()).optional().default([]),
  requirements: z.array(z.string()).optional().default([]),
  skills: z.array(z.string()).optional().default([]),
  location: z.string().min(1, 'Job location is required').trim(),
  workMode: z.enum(['remote', 'onsite', 'hybrid']),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead']),
  salary: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
    currency: z.string().optional().default('USD'),
    period: z.enum(['hourly', 'monthly', 'yearly']).optional().default('yearly'),
  }).optional(),
  benefits: z.array(z.string()).optional().default([]),
  openings: z.number().int().min(1).optional().default(1),
  deadline: z.string().or(z.date()).optional(),
  status: z.enum(['draft', 'active']).optional().default('active'),
});

export const updateJobSchema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters').trim().optional(),
  description: z.string().min(50, 'Job description must be at least 50 characters').optional(),
  category: z.string().min(1, 'Job category is required').trim().optional(),
  responsibilities: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  location: z.string().min(1, 'Job location is required').trim().optional(),
  workMode: z.enum(['remote', 'onsite', 'hybrid']).optional(),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'internship']).optional(),
  experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead']).optional(),
  salary: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
    currency: z.string().optional(),
    period: z.enum(['hourly', 'monthly', 'yearly']).optional(),
  }).optional(),
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
