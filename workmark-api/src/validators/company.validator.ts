import { z } from 'zod';

const foundedYearSchema = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
  z.number().int().min(1800).max(new Date().getFullYear()).optional()
);

const optionalUrlSchema = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? undefined : String(val)),
  z.string().url('Invalid website URL').optional()
);

export const createCompanySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters').trim(),
  description: z.string().optional().or(z.literal('')).or(z.null()),
  industry: z.string().optional().or(z.literal('')).or(z.null()),
  companySize: z.string().optional().or(z.literal('')).or(z.null()),
  size: z.string().optional().or(z.literal('')).or(z.null()),
  location: z.string().optional().or(z.literal('')).or(z.null()),
  website: optionalUrlSchema,
  foundedYear: foundedYearSchema,
  logo: z.string().optional().or(z.literal('')).or(z.null()),
  coverImage: z.string().optional().or(z.literal('')).or(z.null()),
  socialLinks: z
    .object({
      linkedin: z.string().optional().or(z.literal('')).or(z.null()),
      twitter: z.string().optional().or(z.literal('')).or(z.null()),
      facebook: z.string().optional().or(z.literal('')).or(z.null()),
    })
    .optional(),
});

export const updateCompanySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters').trim().optional(),
  description: z.string().optional().or(z.literal('')).or(z.null()),
  industry: z.string().optional().or(z.literal('')).or(z.null()),
  companySize: z.string().optional().or(z.literal('')).or(z.null()),
  size: z.string().optional().or(z.literal('')).or(z.null()),
  location: z.string().optional().or(z.literal('')).or(z.null()),
  website: optionalUrlSchema,
  foundedYear: foundedYearSchema,
  logo: z.string().optional().or(z.literal('')).or(z.null()),
  coverImage: z.string().optional().or(z.literal('')).or(z.null()),
  socialLinks: z
    .object({
      linkedin: z.string().optional().or(z.literal('')).or(z.null()),
      twitter: z.string().optional().or(z.literal('')).or(z.null()),
      facebook: z.string().optional().or(z.literal('')).or(z.null()),
    })
    .optional(),
});
