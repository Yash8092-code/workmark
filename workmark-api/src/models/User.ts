import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['job_seeker', 'employer', 'admin'],
      default: 'job_seeker',
    },
    avatar: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailVerification: {
      otpHash: { type: String },
      otpExpiresAt: { type: Date },
      otpAttempts: { type: Number, default: 0 },
      lastOtpSentAt: { type: Date },
    },
    emailNotifications: {
      newJobs: { type: Boolean, default: true },
      applicationUpdates: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
    },
    jobAlertPreferences: {
      keywords: [{ type: String, trim: true }],
      locations: [{ type: String, trim: true }],
      countries: [{ type: String, trim: true }],
      categories: [{ type: String, trim: true }],
      employmentTypes: [{ type: String, trim: true }],
      workModes: [{ type: String, trim: true }],
      experienceLevels: [{ type: String, trim: true }],
    },
    countryCode: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    },
    countryName: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
