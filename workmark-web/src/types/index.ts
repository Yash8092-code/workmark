// User types
export type UserRole = 'job_seeker' | 'employer' | 'admin';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  _id: string;
  name: string;
  email: string;
  username?: string;
  mobileNumber?: string;
  domains?: string[];
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
  resumeUrl?: string;
  avatar?: string;
  avatarUrl?: string;
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
  companySize?: string;
  foundedYear?: number;
  location?: string;
  website?: string;
  logo?: string;
  logoUrl?: string;
  coverImage?: string;
  coverUrl?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Job types
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
export type WorkMode = 'remote' | 'onsite' | 'hybrid' | 'unknown';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead';
export type JobStatus = 'active' | 'closed' | 'draft';

export type MatchTier = 'Strong Match' | 'Good Match' | 'Worth Exploring' | 'Low Match';
export type OpportunityTag = 'Skill Stretch' | 'Remote' | 'Global' | 'Fresh';
export type MatchConfidence = 'High confidence' | 'Moderate confidence' | 'Limited data';

export interface OpportunityExplanation {
  score: number;
  matchTier: MatchTier;
  matchConfidence: MatchConfidence;
  tags: OpportunityTag[];
  matchingSkills: string[];
  missingSkills: string[];
  allCandidateSkills: string[];
  allJobSkills: string[];
  fitSignals: string[];
  gaps: string[];
  salaryFit: {
    status: 'compatible' | 'below' | 'undisclosed';
    label: string;
    details?: string;
  };
  applicationGuidance: {
    status: 'recommended' | 'skill_stretch' | 'consider_gaps';
    headline: string;
    summary: string;
  };
}

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
  opportunityIntelligence?: OpportunityExplanation;
  newApplicationsCount?: number;
  stageCounts?: {
    pending: number;
    reviewed: number;
    shortlisted: number;
    interview: number;
    accepted: number;
    rejected: number;
  };
}

// Application types
export type CanonicalApplicationStatus = 'pending' | 'reviewed' | 'shortlisted' | 'interview' | 'accepted' | 'rejected';
export type ApplicationStatus = CanonicalApplicationStatus | 'applied' | 'under_review' | 'selected';

export interface InterviewInfo {
  status?: 'scheduled' | 'rescheduled' | 'cancelled' | 'completed';
  scheduledAt?: string;
  date?: string;
  time?: string;
  mode?: 'video' | 'phone' | 'onsite';
  locationOrLink?: string;
  link?: string;
  message?: string;
  notes?: string;
  cancelledReason?: string;
}

export interface Application {
  _id: string;
  jobId: Job;
  applicantId?: User;
  userId?: User;
  employerId?: User;
  profileId?: string | Profile;
  profile?: Profile;
  seekerProfile?: Profile;
  coverLetter?: string;
  resumeUrl?: string;
  resume?: string;
  status: ApplicationStatus;
  isViewedByEmployer?: boolean;
  appliedAt?: string;
  reviewedAt?: string;
  shortlistedAt?: string;
  interviewAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  interview?: InterviewInfo;
  statusHistory: StatusHistory[];
  matchScore?: number;
  opportunityIntelligence?: OpportunityExplanation;
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
  read?: boolean;
  isRead?: boolean;
  link?: string;
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
  identifier?: string;
  email?: string;
  username?: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  mobileNumber: string;
  username: string;
  password: string;
  confirmPassword?: string;
  role?: UserRole;
  companyName?: string;
  countryCode: string;
  countryName?: string;
  domains: string[];
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
  companySize?: string;
  foundedYear?: number;
  location?: string;
  website?: string;
  logo?: string;
  coverImage?: string;
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

export interface SeekerDashboardResponse {
  profileReadiness: {
    percentage: number;
    completedItems: string[];
    missingItems: string[];
  };
  metrics: {
    activeApplications: number;
    savedJobs: number;
    strongMatchesCount: number;
    shortlistedCount: number;
  };
  pipeline: {
    pending: number;
    reviewed: number;
    shortlisted: number;
    interview: number;
    accepted: number;
    rejected: number;
  };
  recommendations: {
    strongMatches: Job[];
    skillStretch: Job[];
    remoteAndGlobal: Job[];
    recentlyAdded: Job[];
  };
  skillInsights: {
    userSkills: string[];
    inDemandSkills: { skill: string; jobCount: number }[];
    marketContext: string;
  };
  recentActivity: {
    id: string;
    type: 'application_submitted' | 'job_saved' | 'status_updated' | 'notification';
    title: string;
    description: string;
    timestamp: string;
    link?: string;
  }[];
}

export interface EmployerDashboardResponse {
  companyReadiness: {
    percentage: number;
    completedItems: string[];
    missingItems: string[];
  };
  metrics: {
    activeJobs: number;
    totalApplications: number;
    candidatesToReview: number;
    shortlistedCandidates: number;
    interviewCandidates?: number;
    hiresCount: number;
  };
  pipeline: {
    pending: number;
    reviewed: number;
    shortlisted: number;
    interview: number;
    accepted: number;
    rejected: number;
  };
  candidatesNeedingAttention: {
    applicationId: string;
    applicantId: string;
    applicantName: string;
    applicantEmail: string;
    applicantPhone?: string;
    applicantAvatar?: string;
    jobId: string;
    jobTitle: string;
    appliedAt: string;
    status: CanonicalApplicationStatus;
    isViewedByEmployer?: boolean;
    matchScore?: number;
    skills: string[];
  }[];
  jobPerformance: {
    jobId: string;
    title: string;
    location: string;
    workMode: string;
    status: 'active' | 'draft' | 'closed' | 'expired';
    applicationsCount: number;
    viewsCount: number;
    conversionRate?: number;
    createdAt: string;
  }[];
  recruitmentInsights: {
    hasEnoughData: boolean;
    insights: string[];
  };
}

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
