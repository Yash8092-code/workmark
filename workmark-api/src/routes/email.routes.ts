import { Router, Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import emailService from '../services/email.service';

const router = Router();

// Middleware ensuring development mode or authorized access
const ensureDevOrAdmin = (req: Request, res: Response, next: any) => {
  const isDev = process.env.NODE_ENV !== 'production';
  if (!isDev) {
    throw new AppError('Email test endpoints are disabled in production mode.', 403);
  }
  next();
};

router.use(ensureDevOrAdmin);

router.get('/test-email', asyncHandler(async (req: Request, res: Response) => {
  const email = (req.query.email as string) || (req.body && req.body.email);

  if (!email) {
    throw new AppError('Target email parameter is required (e.g. ?email=user@example.com)', 400);
  }

  const result = await emailService.sendTestEmail({ to: email });

  if (!result.success) {
    throw new AppError(`Failed to dispatch test email: ${result.error}`, 500);
  }

  res.status(200).json({
    success: true,
    message: `Test email successfully sent to ${email}`,
    data: { messageId: result.messageId },
  });
}));

router.post('/test-email', asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Email is required in request body', 400);
  }

  const result = await emailService.sendTestEmail({ to: email });

  if (!result.success) {
    throw new AppError(`Failed to dispatch test email: ${result.error}`, 500);
  }

  res.status(200).json({
    success: true,
    message: `Test email successfully sent to ${email}`,
    data: { messageId: result.messageId },
  });
}));

export default router;
