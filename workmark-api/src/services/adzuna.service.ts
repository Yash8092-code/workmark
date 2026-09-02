import { getDefaultSearchCountries, getCountry } from '../config/countries';
import { IJobs } from '../types';
import { matchesJobFilter, JobFilterCriteria } from '../utils/helpers';

interface AdzunaJob {
  id: string;
  title?: string;
  description?: string;
  redirect_url?: string;
  created?: string;
  salary_min?: number;
  salary_max?: number;
  salary_is_predicted?: string;
  contract_type?: string;
  contract_time?: string;
  company?: { display_name?: string };
  location?: { display_name?: string; area?: string[] };
  category?: { label?: string; tag?: string };
}

interface AdzunaResponse {
  results?: AdzunaJob[];
  count?: number;
}

export interface ExternalJobFilters extends JobFilterCriteria {
  page: number;
  limit: number;
}

const cache = new Map<string, { expiresAt: number; jobs: NormalizedExternalJob[]; total: number }>();
const CACHE_TTL_MS = 10 * 60_000; // 10 minutes cache

const KNOWN_SKILLS = [
  'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java', 'C++', 'C#', '.NET',
  'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'GraphQL', 'REST API', 'Figma', 'UI/UX',
  'Product Management', 'Data Analysis', 'Machine Learning', 'AI', 'TailwindCSS', 'Next.js',
  'DevOps', 'CI/CD', 'Git', 'Agile', 'Scrum', 'Sales', 'Digital Marketing', 'SEO', 'Finance'
];

const extractSkills = (title?: string, description?: string): string[] => {
  const text = `${title || ''} ${description || ''}`.toLowerCase();
  const matched = new Set<string>();

  for (const skill of KNOWN_SKILLS) {
    const pattern = new RegExp(`\\b${skill.toLowerCase().replace('+', '\\+').replace('.', '\\.')}\\b`, 'i');
    if (pattern.test(text)) {
      matched.add(skill);
    }
  }

  return Array.from(matched).slice(0, 8);
};

const inferWorkMode = (job: AdzunaJob): IJobs['workMode'] => {
  const text = `${job.title || ''} ${job.description || ''} ${job.location?.display_name || ''}`.toLowerCase();
  if (/\b(remote|work from home|wfh|telecommute|anywhere|virtual)\b/.test(text)) return 'remote';
  if (/\b(hybrid|flexible work|partially remote|blended)\b/.test(text)) return 'hybrid';
  return 'onsite';
};

const inferExperienceLevel = (job: AdzunaJob): IJobs['experienceLevel'] => {
  const text = `${job.title || ''} ${job.description || ''}`.toLowerCase();
  if (/\b(lead|principal|director|head of|vp|vice president|chief|architect|executive)\b/.test(text)) {
    return 'lead';
  }
  if (/\b(senior|sr\.|sr |expert|staff|specialist|advanced)\b/.test(text)) {
    return 'senior';
  }
  if (/\b(junior|jr\.|jr |entry|intern|internship|graduate|trainee|associate|fresher|entry-level)\b/.test(text)) {
    return 'entry';
  }
  return 'mid';
};

const mapEmploymentType = (job: AdzunaJob): IJobs['employmentType'] => {
  if (job.contract_type === 'part_time' || job.contract_time === 'part_time') return 'part-time';
  if (job.contract_type === 'contract' || job.contract_time === 'contract') return 'contract';
  if (job.contract_type === 'internship') return 'internship';
  const text = `${job.title || ''} ${job.description || ''}`.toLowerCase();
  if (/\b(freelance|contractor|temporary|temp)\b/.test(text)) return 'freelance';
  if (/\b(intern|internship|trainee)\b/.test(text)) return 'internship';
  if (/\b(part-time|part time)\b/.test(text)) return 'part-time';
  return 'full-time';
};

const normalizeCategory = (job: AdzunaJob): string => {
  const text = `${job.title || ''} ${job.category?.label || ''} ${job.description || ''}`.toLowerCase();
  if (/software|developer|engineer|fullstack|frontend|backend|devops|web|cloud|qa|tech/.test(text)) return 'Engineering';
  if (/design|ui|ux|graphic|creative|product designer/.test(text)) return 'Design';
  if (/product manager|product owner|scrum master|program manager/.test(text)) return 'Product';
  if (/data|analytics|bi|machine learning|scientist|analyst/.test(text)) return 'Data';
  if (/marketing|seo|growth|content|social media|brand/.test(text)) return 'Marketing';
  if (/sales|account executive|business development|bdr|sdr/.test(text)) return 'Sales';
  if (/finance|accountant|accounting|audit|banking|tax/.test(text)) return 'Finance';
  if (/hr|human resources|recruiter|talent|people/.test(text)) return 'HR';
  if (/operations|supply chain|logistics|procurement/.test(text)) return 'Operations';
  if (/support|customer service|help desk|client success/.test(text)) return 'Customer Support';
  if (/healthcare|medical|nurse|doctor|pharma|clinic/.test(text)) return 'Healthcare';
  return job.category?.label || 'Other';
};

export type NormalizedExternalJob = Omit<Partial<IJobs>, '_id' | 'salary'> & Pick<IJobs, 'title' | 'description' | 'category' | 'location' | 'workMode' | 'employmentType' | 'experienceLevel' | 'country' | 'countryCode' | 'source' | 'isExternal'> & {
  salary?: { min?: number; max?: number; currency: string; period: 'yearly' };
};

const normalizeJob = (job: AdzunaJob, countryCode: string): NormalizedExternalJob => {
  const country = getCountry(countryCode);
  const location = job.location?.display_name || country?.name || 'Location not specified';
  const companyName = job.company?.display_name || 'Verified Organization';
  const title = job.title || 'Opportunity';

  return {
    title,
    companyName,
    description: job.description || 'View the complete job description on the source site.',
    category: normalizeCategory(job),
    responsibilities: [],
    requirements: [],
    skills: extractSkills(job.title, job.description),
    location,
    workMode: inferWorkMode(job),
    employmentType: mapEmploymentType(job),
    experienceLevel: inferExperienceLevel(job),
    salary: job.salary_min || job.salary_max ? {
      min: job.salary_min,
      max: job.salary_max,
      currency: country?.currency || 'USD',
      period: 'yearly',
    } : undefined,
    benefits: [],
    openings: 1,
    status: 'active',
    views: 0,
    isFeatured: false,
    country: country?.name || countryCode.toUpperCase(),
    countryCode: countryCode.toLowerCase(),
    source: 'adzuna',
    isExternal: true,
    externalId: job.id,
    externalUrl: job.redirect_url,
    sourceName: 'Adzuna',
    salaryIsPredicted: job.salary_is_predicted === '1',
    lastSyncedAt: new Date(),
    createdAt: job.created ? new Date(job.created) : new Date(),
    updatedAt: new Date(),
    companyLogo: undefined,
    employerId: undefined,
    companyId: undefined,
  };
};

const requestCountry = async (filters: ExternalJobFilters & { countryCode: string }): Promise<{ jobs: NormalizedExternalJob[]; total: number }> => {
  const country = getCountry(filters.countryCode);
  if (!country) throw new Error(`Unsupported Adzuna country: ${filters.countryCode}`);

  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) throw new Error('External job provider is not configured');

  const cacheKey = JSON.stringify({ ...filters, countryCode: filters.countryCode });
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached;

  const baseUrl = process.env.ADZUNA_BASE_URL || 'https://api.adzuna.com/v1/api';
  const page = Math.max(1, filters.page || 1);
  const limit = Math.min(50, Math.max(1, filters.limit || 20));
  const url = new URL(`${baseUrl}/jobs/${country.code}/search/${page}`);
  url.searchParams.set('app_id', appId);
  url.searchParams.set('app_key', appKey);
  url.searchParams.set('results_per_page', String(limit));

  // Translate search parameters to Adzuna
  const searchTerms: string[] = [];
  if (filters.search) searchTerms.push(filters.search);
  if (filters.skills && filters.skills.length > 0) searchTerms.push(filters.skills.join(' '));
  if (filters.categories && filters.categories.length === 1) searchTerms.push(filters.categories[0]);
  if (filters.workModes?.length === 1 && filters.workModes[0] === 'remote' && !searchTerms.some(t => t.toLowerCase().includes('remote'))) {
    searchTerms.push('remote');
  }

  if (searchTerms.length > 0) {
    url.searchParams.set('what', searchTerms.join(' '));
  }

  const locationQuery = filters.city || filters.location;
  if (locationQuery) {
    url.searchParams.set('where', locationQuery);
  }

  if (filters.salaryMin !== undefined) url.searchParams.set('salary_min', String(filters.salaryMin));
  if (filters.salaryMax !== undefined) url.searchParams.set('salary_max', String(filters.salaryMax));

  const response = await fetch(url, { signal: AbortSignal.timeout(8_000) });
  if (!response.ok) throw new Error(`Adzuna request failed with status ${response.status}`);
  const payload = (await response.json()) as AdzunaResponse;

  // Normalize and strictly filter returned jobs against criteria
  const normalized = (payload.results || []).map((job) => normalizeJob(job, country.code));
  const filtered = normalized.filter((job) => matchesJobFilter(job, filters));

  const rawCount = payload.count || filtered.length || 0;
  const result = {
    jobs: filtered,
    total: Math.min(rawCount, 500),
  };

  cache.set(cacheKey, { ...result, expiresAt: Date.now() + CACHE_TTL_MS });
  return result;
};

export const searchExternalJobs = async (filters: ExternalJobFilters) => {
  const countries = filters.countryCode && filters.countryCode !== 'all'
    ? [filters.countryCode]
    : getDefaultSearchCountries();

  const results = await Promise.allSettled(
    countries.map((countryCode) => requestCountry({ ...filters, countryCode }))
  );

  const successful = results.filter(
    (result): result is PromiseFulfilledResult<{ jobs: NormalizedExternalJob[]; total: number }> =>
      result.status === 'fulfilled'
  );

  const allJobs = successful.flatMap((result) => result.value.jobs);

  return {
    jobs: allJobs,
    total: successful.reduce((total, result) => total + result.value.total, 0),
    failed: successful.length !== results.length,
  };
};
