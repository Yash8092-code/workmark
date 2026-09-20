import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  username: string;
  mobileNumber?: string;
  domains?: string[];
  password: string;
  role: 'job_seeker' | 'employer' | 'admin';
  avatar?: string;
  isVerified: boolean;
  emailVerified?: boolean;
  isActive: boolean;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  emailVerification?: {
    otpHash?: string;
    otpExpiresAt?: Date;
    otpAttempts?: number;
    lastOtpSentAt?: Date;
  };
  emailNotifications?: {
    newJobs?: boolean;
    applicationUpdates?: boolean;
    marketing?: boolean;
  };
  jobAlertPreferences?: {
    keywords?: string[];
    locations?: string[];
    countries?: string[];
    categories?: string[];
    employmentTypes?: string[];
    workModes?: string[];
    experienceLevels?: string[];
  };
  countryCode?: string;
  countryName?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IProfile extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  headline?: string;
  bio?: string;
  location?: string;
  phone?: string;
  skills: string[];
  education: IEducation[];
  experience: IExperience[];
  projects: IProject[];
  resumeUrl?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    twitter?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IEducation {
  school?: string;
  institution?: string;
  degree: string;
  field?: string;
  fieldOfStudy?: string;
  startDate?: Date;
  endDate?: Date;
  current?: boolean;
  description?: string;
}

export interface IExperience {
  company: string;
  position?: string;
  title?: string;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  current?: boolean;
  description?: string;
}

export interface IProject {
  title: string;
  description?: string;
  technologies?: string[];
  link?: string;
  url?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface ICompany extends Document {
  _id: Types.ObjectId;
  ownerId: Types.ObjectId;
  name: string;
  slug: string;
  logo?: string;
  coverImage?: string;
  description?: string;
  industry?: string;
  companySize?: string;
  size?: string;
  location?: string;
  website?: string;
  foundedYear?: number;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJobs extends Document {
  _id: Types.ObjectId;
  employerId?: Types.ObjectId;
  companyId?: Types.ObjectId;
  companyName?: string;
  companyLogo?: string;
  title: string;
  description: string;
  category: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  location: string;
  workMode: 'remote' | 'onsite' | 'hybrid' | 'unknown';
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead';
  salary?: {
    min: number;
    max: number;
    currency: string;
    period: 'hourly' | 'monthly' | 'yearly';
  };
  benefits: string[];
  openings: number;
  deadline?: Date;
  status: 'draft' | 'active' | 'closed' | 'expired';
  views: number;
  isFeatured: boolean;
  country: string;
  countryCode: string;
  source: 'workmark' | 'adzuna';
  isExternal: boolean;
  externalId?: string;
  externalUrl?: string;
  sourceName?: string;
  salaryIsPredicted?: boolean;
  lastSyncedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type ApplicationStatus = 'pending' | 'reviewed' | 'shortlisted' | 'interview' | 'rejected' | 'accepted';

export interface IInterview {
  status?: 'scheduled' | 'rescheduled' | 'cancelled' | 'completed';
  scheduledAt?: Date;
  date?: string;
  time?: string;
  mode?: 'video' | 'phone' | 'onsite';
  locationOrLink?: string;
  message?: string;
  cancelledReason?: string;
}

export interface IApplication extends Document {
  _id: Types.ObjectId;
  jobId: Types.ObjectId;
  applicantId: Types.ObjectId;
  employerId: Types.ObjectId;
  resumeUrl?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  isViewedByEmployer: boolean;
  appliedAt: Date;
  reviewedAt?: Date;
  shortlistedAt?: Date;
  interviewAt?: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
  interview?: IInterview;
  statusHistory: IStatusHistory[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IStatusHistory {
  status: ApplicationStatus;
  changedAt: Date;
  note?: string;
  changedBy?: Types.ObjectId;
}

export interface ISavedJob extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  jobId: Types.ObjectId;
  createdAt: Date;
}

export interface INotification extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReport extends Document {
  _id: Types.ObjectId;
  reporterId: Types.ObjectId;
  jobId: Types.ObjectId;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
