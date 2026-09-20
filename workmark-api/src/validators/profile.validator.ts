import { z } from 'zod';

const optionalDate = z.union([z.string(), z.date()]).optional().nullable().transform((val) => {
  if (!val || val === '') return undefined;
  return val;
});

const educationSchema = z.object({
  school: z.string().optional().nullable(),
  institution: z.string().optional().nullable(),
  degree: z.string().optional().nullable(),
  field: z.string().optional().nullable(),
  fieldOfStudy: z.string().optional().nullable(),
  startDate: optionalDate,
  endDate: optionalDate,
  current: z.boolean().optional().default(false),
  description: z.string().optional().nullable(),
});

const experienceSchema = z.object({
  company: z.string().optional().nullable(),
  position: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  startDate: optionalDate,
  endDate: optionalDate,
  current: z.boolean().optional().default(false),
  description: z.string().optional().nullable(),
});

const projectSchema = z.object({
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  technologies: z.array(z.string()).optional().default([]),
  link: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  startDate: optionalDate,
  endDate: optionalDate,
});

export const updateProfileSchema = z.object({
  name: z.string().optional(),
  headline: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  skills: z.array(z.string()).optional(),
  education: z.array(educationSchema).optional(),
  experience: z.array(experienceSchema).optional(),
  projects: z.array(projectSchema).optional(),
  socialLinks: z.object({
    linkedin: z.string().optional().nullable(),
    github: z.string().optional().nullable(),
    portfolio: z.string().optional().nullable(),
    twitter: z.string().optional().nullable(),
  }).optional().nullable(),
});
