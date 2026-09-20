import jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { IJobs, IUser } from '../types';

export const generateToken = (userId: string, role: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign({ userId, role }, jwtSecret, { expiresIn: jwtExpiresIn });
};

export const verifyToken = (token: string): any => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.verify(token, jwtSecret);
};

export const parseArrayParam = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => (typeof item === 'string' ? item.split(',') : []))
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
  }
  return [];
};

export const buildSearchQuery = (searchTerm?: string, fields: string[] = []): any => {
  if (!searchTerm || fields.length === 0) {
    return {};
  }

  return {
    $or: fields.map((field) => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    })),
  };
};

export const buildSortQuery = (sortParam?: string): any => {
  if (!sortParam) {
    return { createdAt: -1 };
  }

  const sortMap: { [key: string]: any } = {
    newest: { createdAt: -1 },
    'createdAt-desc': { createdAt: -1 },
    'createdAt-asc': { createdAt: 1 },
    oldest: { createdAt: 1 },
    salary_high: { 'salary.max': -1, 'salary.min': -1 },
    salary_low: { 'salary.min': 1 },
    'title-asc': { title: 1 },
    'title-desc': { title: -1 },
    views: { views: -1 },
    recommended: { isFeatured: -1, createdAt: -1 },
  };

  return sortMap[sortParam] || { createdAt: -1 };
};

export interface JobFilterCriteria {
  search?: string;
  countryCode?: string;
  location?: string;
  city?: string;
  workModes?: string[];
  categories?: string[];
  employmentTypes?: string[];
  experienceLevels?: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryDisclosed?: boolean;
  skills?: string[];
  source?: string;
  datePostedDays?: number;
}

/**
 * Filter predicate to validate any job (MongoDB or normalized external) against active criteria
 */
export const matchesJobFilter = (job: any, criteria: JobFilterCriteria): boolean => {
  // 1. Country filter
  if (criteria.countryCode && criteria.countryCode !== 'all') {
    const jobCountryCode = (job.countryCode || '').toLowerCase().trim();
    if (jobCountryCode !== criteria.countryCode.toLowerCase().trim()) {
      return false;
    }
  }

  // 2. City / Location filter
  if (criteria.city || criteria.location) {
    const locPattern = (criteria.city || criteria.location || '').toLowerCase();
    const jobLoc = `${job.location || ''} ${job.country || ''}`.toLowerCase();
    if (!jobLoc.includes(locPattern)) {
      return false;
    }
  }

  // 3. Work mode (OR logic within group)
  if (criteria.workModes && criteria.workModes.length > 0) {
    const jobWorkMode = (job.workMode || 'onsite').toLowerCase();
    if (!criteria.workModes.includes(jobWorkMode)) {
      return false;
    }
  }

  // 4. Category (OR logic within group)
  if (criteria.categories && criteria.categories.length > 0) {
    const jobCategory = (job.category || '').toLowerCase();
    const matchesCategory = criteria.categories.some(
      (cat) => jobCategory.includes(cat) || cat.includes(jobCategory)
    );
    if (!matchesCategory) {
      return false;
    }
  }

  // 5. Employment Type (OR logic within group)
  if (criteria.employmentTypes && criteria.employmentTypes.length > 0) {
    const jobEmpType = (job.employmentType || '').toLowerCase();
    if (!criteria.employmentTypes.includes(jobEmpType)) {
      return false;
    }
  }

  // 6. Experience Level (OR logic within group)
  if (criteria.experienceLevels && criteria.experienceLevels.length > 0) {
    const jobExpLevel = (job.experienceLevel || '').toLowerCase();
    if (!criteria.experienceLevels.includes(jobExpLevel)) {
      return false;
    }
  }

  // 7. Salary filters
  const minSal = job.salary?.min;
  const maxSal = job.salary?.max;

  if (criteria.salaryDisclosed) {
    if (minSal === undefined && maxSal === undefined) {
      return false;
    }
  }

  if (criteria.salaryMin !== undefined) {
    if (maxSal !== undefined && maxSal < criteria.salaryMin) return false;
    if (maxSal === undefined && minSal !== undefined && minSal < criteria.salaryMin) return false;
  }

  if (criteria.salaryMax !== undefined) {
    if (minSal !== undefined && minSal > criteria.salaryMax) return false;
  }

  // 8. Skills filter
  if (criteria.skills && criteria.skills.length > 0) {
    const jobSkills = (job.skills || []).map((s: string) => s.toLowerCase());
    const jobText = `${job.title || ''} ${job.description || ''}`.toLowerCase();
    const hasAnySkill = criteria.skills.some(
      (sk: string) => jobSkills.includes(sk) || jobText.includes(sk)
    );
    if (!hasAnySkill) {
      return false;
    }
  }

  // 9. Source filter
  if (criteria.source && criteria.source !== 'all') {
    if (job.source !== criteria.source) {
      return false;
    }
  }

  // 10. Date posted filter
  if (criteria.datePostedDays) {
    const jobDate = job.createdAt ? new Date(job.createdAt).getTime() : 0;
    const cutoff = Date.now() - criteria.datePostedDays * 24 * 60 * 60 * 1000;
    if (jobDate < cutoff) {
      return false;
    }
  }

  // 11. Keyword / Search term filter
  if (criteria.search) {
    const term = criteria.search.toLowerCase();
    const searchBlob = `${job.title || ''} ${job.description || ''} ${job.companyName || ''} ${(job.skills || []).join(' ')}`.toLowerCase();
    if (!searchBlob.includes(term)) {
      return false;
    }
  }

  return true;
};

import { calculateOpportunityIntelligence } from '../services/opportunity.service';

/**
 * Deterministic recommendation scoring system (0 - 100) using Opportunity Intelligence Engine
 */
export const calculateJobMatchScore = (job: any, user?: any, profile?: any): number => {
  if (!user) return 0;
  const intel = calculateOpportunityIntelligence(job, user, profile);
  return intel.score;
};

interface PaginationOptions {
  page?: number;
  limit?: number;
}

interface PaginationResult<T> {
  data: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const paginate = async <T>(
  model: Model<T>,
  query: any,
  options: PaginationOptions = {},
  populate?: string | string[],
  sort: any = { createdAt: -1 }
): Promise<PaginationResult<T>> => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  let queryBuilder: any = model.find(query).sort(sort).skip(skip).limit(limit);

  if (populate) {
    if (Array.isArray(populate)) {
      populate.forEach((pop) => {
        queryBuilder = queryBuilder.populate(pop);
      });
    } else {
      queryBuilder = queryBuilder.populate(populate);
    }
  }

  const data = await queryBuilder.exec();
  const total = await model.countDocuments(query);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};
