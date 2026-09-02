import { z } from 'zod';

export const applySchema = z.object({
  coverLetter: z.string().optional(),
  resumeUrl: z.string().optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted']),
});
