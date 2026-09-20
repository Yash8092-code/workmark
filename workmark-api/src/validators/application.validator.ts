import { z } from 'zod';

export const applySchema = z.object({
  coverLetter: z.string().optional(),
  resumeUrl: z.string().optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['pending', 'reviewed', 'shortlisted', 'interview', 'rejected', 'accepted']),
  note: z.string().optional(),
  interviewAction: z.enum(['schedule', 'reschedule', 'cancel']).optional(),
  interviewDate: z.string().optional(),
  interviewTime: z.string().optional(),
  interviewMode: z.enum(['video', 'phone', 'onsite']).optional(),
  interviewLocation: z.string().optional(),
  interviewMessage: z.string().optional(),
  cancelledReason: z.string().optional(),
});
