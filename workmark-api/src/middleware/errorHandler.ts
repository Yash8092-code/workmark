import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { ZodError } from 'zod';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  let error = { ...err } as any;
  error.message = err.message;

  console.error('Error:', err);

  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404);
  }

  if ((err as any).code === 11000) {
    const keyPattern = (err as any).keyPattern || {};
    const field = Object.keys(keyPattern)[0] || 'Record';
    let message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    if (keyPattern.source && keyPattern.externalId) {
      message = 'This external job listing has already been imported.';
    } else if (keyPattern.email) {
      message = 'An account with this email address already exists.';
    } else if (keyPattern.userId) {
      message = 'A profile for this user already exists.';
    }
    error = new AppError(message, 400);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values((err as any).errors)
      .map((val: any) => val.message)
      .join(', ');
    error = new AppError(message, 400);
  }

  if (err instanceof ZodError) {
    const message = err.issues.map((e) => e.message).join(', ');
    error = new AppError(message, 400);
  }

  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new AppError(message, 401);
  }

  if ((err as any).code === 8000) {
    const message = 'Database access is not configured for the API user';
    error = new AppError(message, 503);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Server Error';

  res.status(statusCode).json({
    success: false,
    message,
  });
};
