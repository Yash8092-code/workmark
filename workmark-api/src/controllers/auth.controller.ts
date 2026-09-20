import { Request, Response } from 'express';
import crypto from 'crypto';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import User from '../models/User';
import Profile from '../models/Profile';
import Company from '../models/Company';
import { generateToken } from '../utils/helpers';
import emailService from '../services/email.service';
import slugify from 'slugify';
import { getCountry } from '../config/countries';

const hashValue = (value: string): string => {
  return crypto.createHash('sha256').update(value).digest('hex');
};

const generate6DigitOTP = (): string => {
  return crypto.randomInt(100000, 1000000).toString();
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    email,
    mobileNumber,
    username,
    password,
    role,
    companyName,
    countryCode,
    countryName,
    domains,
  } = req.body;

  let validatedCountryCode: string | undefined;
  let validatedCountryName: string | undefined;

  if (countryCode) {
    const matched = getCountry(countryCode);
    if (matched) {
      validatedCountryCode = matched.code;
      validatedCountryName = matched.name;
    } else {
      validatedCountryCode = countryCode.toLowerCase().trim();
      validatedCountryName = countryName || countryCode;
    }
  }

  const cleanEmail = email.toLowerCase().trim();
  const cleanUsername = (username || email.split('@')[0]).toLowerCase().trim();

  // Check if email already registered
  const existingEmailUser = await User.findOne({ email: cleanEmail });
  if (existingEmailUser) {
    throw new AppError('An account with this email address already exists.', 400);
  }

  // Check if username already registered
  const existingUsernameUser = await User.findOne({ username: cleanUsername });
  if (existingUsernameUser) {
    throw new AppError('This username is already taken. Please choose another username.', 400);
  }

  const selectedDomains: string[] = Array.isArray(domains) ? domains.filter(Boolean) : [];

  const user = await User.create({
    name,
    email: cleanEmail,
    username: cleanUsername,
    mobileNumber: mobileNumber?.trim(),
    domains: selectedDomains,
    password,
    role: role || 'job_seeker',
    isVerified: true,
    emailVerified: true,
    countryCode: validatedCountryCode,
    countryName: validatedCountryName,
    emailNotifications: {
      newJobs: true,
      applicationUpdates: true,
      marketing: false,
    },
    jobAlertPreferences: {
      keywords: selectedDomains,
      locations: [],
      countries: validatedCountryCode ? [validatedCountryCode] : [],
      categories: selectedDomains,
      employmentTypes: [],
      workModes: [],
      experienceLevels: [],
    },
  });

  if (user.role === 'job_seeker') {
    await Profile.create({
      userId: user._id,
      phone: mobileNumber?.trim(),
      skills: selectedDomains,
      education: [],
      experience: [],
      projects: [],
    });
  }

  if (user.role === 'employer' && companyName) {
    await Company.create({
      ownerId: user._id,
      name: companyName,
      slug: `${slugify(companyName, { lower: true, strict: true })}-${user._id.toString().slice(-6)}`,
    });
  }

  const token = generateToken(user._id.toString(), user.role);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    message: 'Account created successfully! Welcome to Workmark.',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        mobileNumber: user.mobileNumber,
        domains: user.domains,
        role: user.role,
        avatar: user.avatar,
        isVerified: true,
        emailVerified: true,
        isActive: user.isActive,
        countryCode: user.countryCode,
        countryName: user.countryName,
      },
      token,
      requireVerification: false,
    },
  });
});

export const verifyEmail = asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Email verification is disabled. You are fully verified.',
  });
});

export const resendOTP = asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Email verification is disabled. No verification code is required.',
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { identifier, email, username, password } = req.body;

  const loginId = (identifier || email || username || '').toLowerCase().trim();

  if (!loginId) {
    throw new AppError('Username or email is required', 400);
  }

  const user = await User.findOne({
    $or: [{ email: loginId }, { username: loginId }],
  }).select('+password');

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!user.isActive) {
    throw new AppError('Your account has been suspended. Please contact support.', 403);
  }

  const token = generateToken(user._id.toString(), user.role);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        mobileNumber: user.mobileNumber,
        domains: user.domains,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified ?? true,
        emailVerified: user.emailVerified ?? true,
        isActive: user.isActive,
        countryCode: user.countryCode,
        countryName: user.countryName,
      },
      token,
    },
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        mobileNumber: user.mobileNumber,
        domains: user.domains,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified ?? true,
        emailVerified: user.emailVerified ?? true,
        isActive: user.isActive,
        countryCode: user.countryCode,
        countryName: user.countryName,
        emailNotifications: user.emailNotifications,
        jobAlertPreferences: user.jobAlertPreferences,
      },
    },
  });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    // Avoid user enumeration
    res.status(200).json({
      success: true,
      message: 'If an account exists with that email, a password reset link has been sent.',
    });
    return;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = hashValue(resetToken);
  user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

  await user.save({ validateBeforeSave: false });

  const clientUrl = process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[DEV PASSWORD RESET] Reset URL for ${email}: ${resetUrl}`);
  }

  try {
    await emailService.sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl,
      expiresInMinutes: 10,
    });

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email',
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    throw new AppError('Email could not be sent. Please try again.', 500);
  }
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const token = req.body.token || req.params.token || (req.query.token as string);
  const { password } = req.body;

  if (!token) {
    throw new AppError('Reset token is required', 400);
  }

  const resetPasswordToken = hashValue(token);

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const jwtToken = generateToken(user._id.toString(), user.role);

  res.cookie('token', jwtToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: 'Password reset successful',
    data: {
      token: jwtToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
        isActive: user.isActive,
      },
    },
  });
});

export const getPreferences = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    data: {
      emailNotifications: user.emailNotifications || {
        newJobs: true,
        applicationUpdates: true,
        marketing: false,
      },
      jobAlertPreferences: user.jobAlertPreferences || {
        keywords: [],
        locations: [],
        countries: [],
        categories: [],
        employmentTypes: [],
        workModes: [],
        experienceLevels: [],
      },
    },
  });
});

export const updatePreferences = asyncHandler(async (req: Request, res: Response) => {
  const { emailNotifications, jobAlertPreferences } = req.body;

  const updateFields: any = {};
  if (emailNotifications) {
    updateFields.emailNotifications = emailNotifications;
  }
  if (jobAlertPreferences) {
    updateFields.jobAlertPreferences = jobAlertPreferences;
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Preferences updated successfully',
    data: {
      emailNotifications: user.emailNotifications,
      jobAlertPreferences: user.jobAlertPreferences,
    },
  });
});

export const updateCountry = asyncHandler(async (req: Request, res: Response) => {
  const { countryCode, countryName } = req.body;

  if (!countryCode) {
    throw new AppError('Country code is required', 400);
  }

  const matched = getCountry(countryCode);
  const normalizedCode = matched ? matched.code : countryCode.toLowerCase().trim();
  const normalizedName = matched ? matched.name : (countryName || countryCode);

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.countryCode = normalizedCode;
  user.countryName = normalizedName;

  if (!user.jobAlertPreferences) {
    user.jobAlertPreferences = { countries: [normalizedCode] };
  } else {
    // Ensure the new country is in their job alert preferences
    const existingCountries = user.jobAlertPreferences.countries || [];
    if (!existingCountries.includes(normalizedCode)) {
      user.jobAlertPreferences.countries = [normalizedCode, ...existingCountries.filter(c => c !== normalizedCode)];
    }
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Your job preferences have been updated.',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
        emailVerified: user.emailVerified,
        isActive: user.isActive,
        countryCode: user.countryCode,
        countryName: user.countryName,
        emailNotifications: user.emailNotifications,
        jobAlertPreferences: user.jobAlertPreferences,
      },
    },
  });
});
