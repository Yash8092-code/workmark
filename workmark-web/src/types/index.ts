// User types
export type UserRole = 'job_seeker' | 'employer' | 'admin';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: UserStatus;
  avatar?: string;
  isVerified?: boolean;
  emailVerified?: boolean;
  profileCompleted?: boolean;
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
  createdAt: string;
  updatedAt: string;
}

// Profile types
export interface Profile {
  _id: string;
  userId: string;
  headline?: string;
  location?: string;
  phone?: string;
  bio?: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  resume?: string;
  avatar?: string;
  socialLinks: SocialLinks;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  _id?: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Education {
  _id?: string;
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Project {
  _id?: string;
  title: string;
  description: string;
  url?: string;
  technologies: string[];
  startDate?: string;
  endDate?: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  twitter?: string;
}

// Company types
export interface Company {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  industry?: string;
  size?: string;
  foundedYear?: number;
  location?: string;
  website?: string;
  logo?: string;
  coverImage?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Job types
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
export type WorkMode = 'remote' | 'onsite' | 'hybrid' | 'unknown';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead';
export type JobStatus = 'active' | 'closed' | 'draft';

export interface Job {
  _id: string;
  companyId: Company;
  userId: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  category: string;
  employmentType: EmploymentType;
  workMode: WorkMode;
  experienceLevel: ExperienceLevel;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  skills: string[];
  benefits?: string[];
  applicationDeadline?: string;
  status: JobStatus;
  featured: boolean;
  viewCount: number;
  applicationCount: number;
  createdAt: string;
  updatedAt: string;
  companyName?: string;
  companyLogo?: string;
  country?: string;
  countryCode?: string;
  source?: 'workmark' | 'adzuna';
  isExternal?: boolean;
  externalUrl?: string;
  sourceName?: string;
  salaryIsPredicted?: boolean;
  salary?: { min?: number; max?: number; currency?: string };
  matchScore?: number;
}

// Application types
export type ApplicationStatus = 'applied' | 'under_review' | 'shortlisted' | 'interview' | 'selected' | 'rejected';

export interface Application {
  _id: string;
  jobId: Job;
  userId: User;
  profileId: string;
  coverLetter?: string;
  resume: string;
  status: ApplicationStatus;
  statusHistory: StatusHistory[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StatusHistory {
  status: ApplicationStatus;
  changedAt: string;
  changedBy?: string;
  note?: string;
}

// Saved Job types
export interface SavedJob {
  _id: string;
  userId: string;
  jobId: Job;
  createdAt: string;
}

// Notification types
export interface Notification {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  relatedId?: string;
  relatedModel?: string;
  createdAt: string;
}

// Report types
export interface Report {
  _id: string;
  reporterId: string;
  reportedId: string;
  reportedModel: 'Job' | 'Company' | 'User';
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  createdAt: string;
}

// Auth types
export interface AuthResponse {
  token: string;
  user: User;
  requireVerification?: boolean;
}

export interface VerifyEmailInput {
  email: string;
  otp: string;
}

export interface ResendOTPInput {
  email: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  companyName?: string;
  countryCode?: string;
  countryName?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

// Filter types
export interface JobFilters {
  search?: string;
  keyword?: string;
  location?: string;
  city?: string;
  category?: string;
  employmentType?: EmploymentType[];
  workMode?: WorkMode[];
  experienceLevel?: ExperienceLevel[];
  salaryMin?: number;
  salaryMax?: number;
  salaryDisclosed?: boolean;
  skills?: string[];
  datePosted?: string;
  country?: string;
  source?: 'all' | 'workmark' | 'adzuna';
}

export interface JobSearchParams extends JobFilters {
  page?: number;
  limit?: number;
  sort?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Form types
export interface ProfileFormData {
  headline?: string;
  location?: string;
  phone?: string;
  bio?: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  socialLinks: SocialLinks;
}

export interface CompanyFormData {
  name: string;
  description?: string;
  industry?: string;
  size?: string;
  foundedYear?: number;
  location?: string;
  website?: string;
}

export interface JobFormData {
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  category: string;
  employmentType: EmploymentType;
  workMode: WorkMode;
  experienceLevel: ExperienceLevel;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  skills: string[];
  benefits?: string[];
  applicationDeadline?: string;
  status: JobStatus;
}

// Admin Dashboard Stats
export interface AdminStats {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  totalCompanies: number;
  recentActivity: {
    newUsers: number;
    newJobs: number;
    newApplications: number;
  };
}
