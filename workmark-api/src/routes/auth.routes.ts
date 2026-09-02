import { Router } from 'express';
import {
  register,
  login,
  logout,
  getMe,
  verifyEmail,
  resendOTP,
  forgotPassword,
  resetPassword,
  getPreferences,
  updatePreferences,
  updateCountry,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendOTPSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updatePreferencesSchema,
  updateCountrySchema,
} from '../validators/auth.validator';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/verify-email', validate(verifyEmailSchema), verifyEmail);
router.post('/verify-otp', validate(verifyEmailSchema), verifyEmail);
router.post('/resend-otp', validate(resendOTPSchema), resendOTP);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.post('/reset-password/:token', validate(resetPasswordSchema), resetPassword);

// User country preference
router.put('/country', authenticate, validate(updateCountrySchema), updateCountry);

// User notification and job alert preferences
router.get('/preferences', authenticate, getPreferences);
router.put('/preferences', authenticate, validate(updatePreferencesSchema), updatePreferences);

export default router;
