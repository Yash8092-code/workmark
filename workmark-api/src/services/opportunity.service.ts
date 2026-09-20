import { IJobs, IUser, IProfile } from '../types';
import { getCountry } from '../config/countries';

export interface NormalizedSkill {
  name: string;
  category?: string;
}

// Canonical Skill Dictionary & Synonym Normalization Map
export const SKILL_NORMALIZATION_MAP: Record<string, string> = {
  'react': 'React',
  'react.js': 'React',
  'reactjs': 'React',
  'react native': 'React Native',
  'typescript': 'TypeScript',
  'ts': 'TypeScript',
  'javascript': 'JavaScript',
  'js': 'JavaScript',
  'node': 'Node.js',
  'node.js': 'Node.js',
  'nodejs': 'Node.js',
  'express': 'Express.js',
  'express.js': 'Express.js',
  'next.js': 'Next.js',
  'nextjs': 'Next.js',
  'vue': 'Vue.js',
  'vue.js': 'Vue.js',
  'vuejs': 'Vue.js',
  'angular': 'Angular',
  'angularjs': 'Angular',
  'python': 'Python',
  'django': 'Django',
  'fastapi': 'FastAPI',
  'flask': 'Flask',
  'java': 'Java',
  'spring': 'Spring Boot',
  'spring boot': 'Spring Boot',
  'c++': 'C++',
  'cpp': 'C++',
  'c#': 'C#',
  'csharp': 'C#',
  '.net': '.NET',
  'dotnet': '.NET',
  'asp.net': 'ASP.NET',
  'golang': 'Go',
  'go': 'Go',
  'rust': 'Rust',
  'ruby': 'Ruby',
  'rails': 'Ruby on Rails',
  'ruby on rails': 'Ruby on Rails',
  'php': 'PHP',
  'laravel': 'Laravel',
  'swift': 'Swift',
  'kotlin': 'Kotlin',
  'flutter': 'Flutter',
  'sql': 'SQL',
  'postgresql': 'PostgreSQL',
  'postgres': 'PostgreSQL',
  'mysql': 'MySQL',
  'mongodb': 'MongoDB',
  'mongo': 'MongoDB',
  'redis': 'Redis',
  'graphql': 'GraphQL',
  'rest': 'REST APIs',
  'rest api': 'REST APIs',
  'restful': 'REST APIs',
  'rest apis': 'REST APIs',
  'aws': 'AWS',
  'amazon web services': 'AWS',
  'azure': 'Azure',
  'gcp': 'GCP',
  'google cloud': 'GCP',
  'docker': 'Docker',
  'kubernetes': 'Kubernetes',
  'k8s': 'Kubernetes',
  'terraform': 'Terraform',
  'ci/cd': 'CI/CD',
  'git': 'Git',
  'github': 'Git',
  'figma': 'Figma',
  'ui/ux': 'UI/UX Design',
  'ui design': 'UI/UX Design',
  'ux design': 'UI/UX Design',
  'tailwindcss': 'TailwindCSS',
  'tailwind': 'TailwindCSS',
  'tailwind css': 'TailwindCSS',
  'machine learning': 'Machine Learning',
  'ml': 'Machine Learning',
  'deep learning': 'Deep Learning',
  'ai': 'Artificial Intelligence',
  'data analysis': 'Data Analysis',
  'product management': 'Product Management',
  'agile': 'Agile',
  'scrum': 'Scrum',
  'devops': 'DevOps',
  'linux': 'Linux',
  'microservices': 'Microservices',
};

// Canonical list of standard skills for extraction regex
export const CANONICAL_SKILLS = Array.from(
  new Set(Object.values(SKILL_NORMALIZATION_MAP))
);

export function normalizeSkill(skill: string): string {
  if (!skill) return '';
  const trimmed = skill.trim().toLowerCase();
  if (SKILL_NORMALIZATION_MAP[trimmed]) {
    return SKILL_NORMALIZATION_MAP[trimmed];
  }
  // Title case fallback
  return skill.trim().replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));
}

/**
 * Token-aware skill extraction from job title, description, and tags.
 * Avoids false substring matches (e.g., "Java" will NOT match inside "JavaScript", "C" won't match "CSS").
 */
export function extractAndNormalizeSkills(
  title: string = '',
  description: string = '',
  existingSkills: string[] = []
): string[] {
  const normalized = new Set<string>();

  // 1. Process explicit skills first
  for (const s of existingSkills) {
    if (s && s.trim()) {
      normalized.add(normalizeSkill(s));
    }
  }

  // 2. Token-aware scan of text
  const text = ` ${title} ${description} `.toLowerCase();

  for (const [patternKey, canonicalName] of Object.entries(SKILL_NORMALIZATION_MAP)) {
    // Escape special regex characters like +, ., #
    const escaped = patternKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Strict word/token boundary
    let regex: RegExp;
    if (/^[a-z0-9]/.test(patternKey) && /[a-z0-9]$/.test(patternKey)) {
      regex = new RegExp(`\\b${escaped}\\b`, 'i');
    } else {
      // Special characters like C++, .NET, C#
      regex = new RegExp(`(?:^|[\\s,;.:/()])${escaped}(?=[\\s,;.:/()]|$)`, 'i');
    }

    if (regex.test(text)) {
      // Prevent Java from matching JavaScript
      if (patternKey === 'java' && /\bjavascript\b/i.test(text) && !/\bjava\b(?!\s*script)/i.test(text)) {
        continue;
      }
      normalized.add(canonicalName);
    }
  }

  return Array.from(normalized);
}

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

/**
 * Calculates deterministic Opportunity Intelligence score (0 - 100) & detailed explanation.
 * Base 100 points:
 * - Skills: 35%
 * - Experience: 20%
 * - Location / Country: 20%
 * - Work Mode: 15%
 * - Category / Role: 10%
 * Salary is strictly separate and NOT added to the 100 score.
 */
export function calculateOpportunityIntelligence(
  job: any,
  user?: any,
  profile?: any
): OpportunityExplanation {
  // Extract and normalize job skills
  const jobSkills = extractAndNormalizeSkills(job.title, job.description, job.skills || []);

  // Collect user skills
  const userRawSkills: string[] = [];
  if (profile?.skills && Array.isArray(profile.skills)) {
    userRawSkills.push(...profile.skills);
  }
  if (user?.jobAlertPreferences?.keywords && Array.isArray(user.jobAlertPreferences.keywords)) {
    userRawSkills.push(...user.jobAlertPreferences.keywords);
  }
  const userSkills = Array.from(new Set(userRawSkills.map(normalizeSkill).filter(Boolean)));

  const userCountry = (user?.countryCode || '').toLowerCase().trim();
  const jobCountry = (job.countryCode || job.country || '').toLowerCase().trim();
  const userWorkModes = (user?.jobAlertPreferences?.workModes || []).map((w: string) => w.toLowerCase());
  const userCategories = (user?.jobAlertPreferences?.categories || []).map((c: string) => c.toLowerCase());
  const userExpLevels = (user?.jobAlertPreferences?.experienceLevels || []).map((e: string) => e.toLowerCase());

  // Count user profile signals
  let userSignalsCount = 0;
  if (userSkills.length > 0) userSignalsCount += 2;
  if (userCountry) userSignalsCount += 1;
  if (userWorkModes.length > 0) userSignalsCount += 1;
  if (userCategories.length > 0) userSignalsCount += 1;
  if (userExpLevels.length > 0 || (profile?.experience && profile.experience.length > 0)) userSignalsCount += 1;

  // If user has virtually no profile data, return limited data state
  const hasLowProfileData = userSignalsCount < 2;

  // 1. Skill Overlap (Max 35 points)
  let skillScore = 0;
  const matchingSkills: string[] = [];
  const missingSkills: string[] = [];

  if (jobSkills.length > 0 && userSkills.length > 0) {
    for (const jSkill of jobSkills) {
      if (userSkills.some((uSkill) => uSkill.toLowerCase() === jSkill.toLowerCase())) {
        matchingSkills.push(jSkill);
      } else {
        missingSkills.push(jSkill);
      }
    }
    const overlapRatio = matchingSkills.length / Math.min(jobSkills.length, Math.max(userSkills.length, 4));
    skillScore = Math.min(35, Math.round(overlapRatio * 35));
  } else if (userSkills.length > 0 && jobSkills.length === 0) {
    // Job has no skills listed, check text token match
    const jobText = `${job.title || ''} ${job.description || ''}`.toLowerCase();
    for (const uSkill of userSkills) {
      const escaped = uSkill.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (new RegExp(`\\b${escaped}\\b`, 'i').test(jobText)) {
        matchingSkills.push(uSkill);
      }
    }
    if (matchingSkills.length > 0) {
      skillScore = Math.min(25, matchingSkills.length * 8);
    }
  }

  // 2. Experience Compatibility (Max 20 points)
  let experienceScore = 0;
  const jobExp = (job.experienceLevel || 'mid').toLowerCase();
  
  if (userExpLevels.length > 0) {
    if (userExpLevels.includes(jobExp)) {
      experienceScore = 20;
    } else {
      // Adjacent check
      const levelRank: Record<string, number> = { entry: 1, mid: 2, senior: 3, lead: 4 };
      const jobRank = levelRank[jobExp] || 2;
      const closestDiff = Math.min(...userExpLevels.map((lvl: string) => Math.abs((levelRank[lvl] || 2) - jobRank)));
      if (closestDiff === 1) {
        experienceScore = 10;
      }
    }
  } else if (profile?.experience && profile.experience.length > 0) {
    // Infer experience from years in profile
    const expCount = profile.experience.length;
    if (jobExp === 'entry' && expCount <= 2) experienceScore = 20;
    else if (jobExp === 'mid' && expCount >= 1 && expCount <= 5) experienceScore = 20;
    else if (jobExp === 'senior' && expCount >= 3) experienceScore = 20;
    else if (jobExp === 'lead' && expCount >= 5) experienceScore = 20;
    else experienceScore = 12;
  } else {
    // Default baseline if unknown
    experienceScore = 10;
  }

  // 3. Location / Target Country Compatibility (Max 20 points)
  let locationScore = 0;
  const isRemote = (job.workMode || '').toLowerCase() === 'remote';
  const isSameCountry = userCountry && jobCountry && (userCountry === jobCountry || jobCountry === 'unknown');

  if (isSameCountry) {
    locationScore += 15;
    // Check if city matches
    const userCity = (profile?.location || '').toLowerCase();
    const jobLoc = (job.location || '').toLowerCase();
    if (userCity && jobLoc && jobLoc.includes(userCity)) {
      locationScore += 5;
    } else if (isRemote) {
      locationScore += 5;
    }
  } else if (isRemote) {
    locationScore = 18; // Remote roles are globally accessible
  } else if (!userCountry) {
    locationScore = 10;
  }

  // 4. Work Mode Compatibility (Max 15 points)
  let workModeScore = 0;
  const jobMode = (job.workMode || 'onsite').toLowerCase();
  if (userWorkModes.length > 0) {
    if (userWorkModes.includes(jobMode)) {
      workModeScore = 15;
    } else if (userWorkModes.includes('remote') && jobMode === 'hybrid') {
      workModeScore = 8;
    }
  } else {
    workModeScore = 10;
  }

  // 5. Category / Domain Compatibility (Max 10 points)
  let categoryScore = 0;
  const jobCategory = (job.category || '').toLowerCase();
  if (userCategories.length > 0) {
    if (userCategories.some((cat: string) => cat === jobCategory || jobCategory.includes(cat) || cat.includes(jobCategory))) {
      categoryScore = 10;
    }
  } else {
    categoryScore = 6;
  }

  // Calculate Base Total Score (0 - 100)
  const totalScore = hasLowProfileData
    ? 0
    : Math.min(100, Math.max(0, skillScore + experienceScore + locationScore + workModeScore + categoryScore));

  // Determine Match Tier
  let matchTier: MatchTier = 'Low Match';
  if (totalScore >= 75) matchTier = 'Strong Match';
  else if (totalScore >= 60) matchTier = 'Good Match';
  else if (totalScore >= 45) matchTier = 'Worth Exploring';

  // Determine Orthogonal Tags
  const tags: OpportunityTag[] = [];

  // Skill Stretch Tag: User matches 40-75% skills with category or experience alignment
  const skillMatchRatio = jobSkills.length > 0 ? matchingSkills.length / jobSkills.length : 0;
  if (
    (skillMatchRatio >= 0.4 && skillMatchRatio < 0.8 && missingSkills.length > 0 && missingSkills.length <= 4) ||
    (totalScore >= 50 && totalScore < 75 && missingSkills.length > 0)
  ) {
    tags.push('Skill Stretch');
  }

  if (isRemote) {
    tags.push('Remote');
  }

  if (jobCountry && userCountry && jobCountry !== userCountry && jobCountry !== 'unknown') {
    tags.push('Global');
  }

  // Fresh tag: created within 3 days
  if (job.createdAt) {
    const ageDays = (Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    if (ageDays <= 3) {
      tags.push('Fresh');
    }
  }

  // Match Confidence
  let matchConfidence: MatchConfidence = 'Moderate confidence';
  const hasDetailedJobDesc = (job.description || '').length > 250 || (job.requirements && job.requirements.length > 0);
  if (hasLowProfileData || !hasDetailedJobDesc) {
    matchConfidence = 'Limited data';
  } else if (userSignalsCount >= 4 && hasDetailedJobDesc && jobSkills.length >= 3) {
    matchConfidence = 'High confidence';
  }

  // Fit Signals Evidence
  const fitSignals: string[] = [];
  if (matchingSkills.length > 0) {
    fitSignals.push(`${matchingSkills.length} of your verified skills align with this role (${matchingSkills.slice(0, 3).join(', ')}${matchingSkills.length > 3 ? '...' : ''})`);
  }
  if (isSameCountry) {
    fitSignals.push(`Location aligns with your target market (${getCountry(jobCountry)?.name || job.country || 'Target Country'})`);
  }
  if (isRemote) {
    fitSignals.push('Offers full remote flexibility');
  }
  if (experienceScore >= 18) {
    fitSignals.push(`Experience level (${job.experienceLevel || 'Mid'} level) fits your career stage`);
  }
  if (categoryScore >= 8) {
    fitSignals.push(`Direct domain match in ${job.category}`);
  }

  // Potential Gaps
  const gaps: string[] = [];
  if (missingSkills.length > 0) {
    gaps.push(`${missingSkills.slice(0, 3).join(', ')} requested by employer but not found in profile`);
  }
  if (!isSameCountry && !isRemote) {
    gaps.push(`Onsite position located in ${job.location || job.country || 'different country'}`);
  }
  if (experienceScore < 10 && userExpLevels.length > 0) {
    gaps.push(`Employer seeks ${job.experienceLevel} level, which differs from your target preference`);
  }

  // Salary Fit (Separate Signal)
  const salaryMin = job.salary?.min;
  const salaryMax = job.salary?.max;
  let salaryFit: OpportunityExplanation['salaryFit'] = {
    status: 'undisclosed',
    label: 'Salary: Not enough data',
  };

  if (salaryMin || salaryMax) {
    const curr = job.salary?.currency || '$';
    const amountStr = salaryMin && salaryMax
      ? `${curr}${salaryMin.toLocaleString()} - ${curr}${salaryMax.toLocaleString()}`
      : salaryMin
      ? `From ${curr}${salaryMin.toLocaleString()}`
      : `Up to ${curr}${salaryMax!.toLocaleString()}`;
    
    salaryFit = {
      status: 'compatible',
      label: `Disclosed: ${amountStr} / year`,
      details: 'Compensation openly shared by employer',
    };
  }

  // Application Guidance
  let applicationGuidance: OpportunityExplanation['applicationGuidance'] = {
    status: 'recommended',
    headline: 'Recommended Opportunity',
    summary: 'Strong skill overlap and market alignment. You meet core requirements for this position.',
  };

  if (tags.includes('Skill Stretch')) {
    applicationGuidance = {
      status: 'skill_stretch',
      headline: 'Skill Stretch Opportunity',
      summary: `You have solid foundational skills for this role. Developing ${missingSkills.slice(0, 2).join(' & ')} will enhance your positioning.`,
    };
  } else if (totalScore < 50 || gaps.length >= 2) {
    applicationGuidance = {
      status: 'consider_gaps',
      headline: 'Review Requirements Carefully',
      summary: 'Notable skill or location differences detected. Consider tailoring your application to address key gaps.',
    };
  }

  return {
    score: totalScore,
    matchTier,
    matchConfidence,
    tags,
    matchingSkills,
    missingSkills,
    allCandidateSkills: userSkills,
    allJobSkills: jobSkills,
    fitSignals,
    gaps,
    salaryFit,
    applicationGuidance,
  };
}
