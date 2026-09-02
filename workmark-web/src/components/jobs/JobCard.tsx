import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Clock, Bookmark, BookmarkCheck, ExternalLink, Sparkles, Building2 } from 'lucide-react';
import type { Job } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { useSaveJob, useUnsaveJob } from '../../hooks/useSavedJobs';
import { getCountryFlag, getCountryDisplayName } from '../../utils/countries';

interface JobCardProps {
  job: Job;
  isSaved?: boolean;
  matchScore?: number;
}

export const JobCard: React.FC<JobCardProps> = ({ job, isSaved = false, matchScore }) => {
  const [saved, setSaved] = useState(isSaved);
  const saveJobMutation = useSaveJob();
  const unsaveJobMutation = useUnsaveJob();

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (saved) {
      unsaveJobMutation.mutate(job._id);
      setSaved(false);
    } else {
      saveJobMutation.mutate(job._id);
      setSaved(true);
    }
  };

  const companyData = typeof job.companyId === 'object' ? job.companyId : null;
  const companyName = companyData?.name || job.companyName || 'Verified Organization';
  const companyLogo = companyData?.logo || job.companyLogo;
  const isExternal = job.isExternal || job.source === 'adzuna';

  const salaryMin = job.salaryMin ?? job.salary?.min;
  const salaryMax = job.salaryMax ?? job.salary?.max;
  const salaryCurrency = job.salaryCurrency || job.salary?.currency || '$';

  const workMode = job.workMode || 'onsite';
  const countryDisplayName = getCountryDisplayName(job.country || job.countryCode);
  const countryFlag = getCountryFlag(job.country || job.countryCode);

  const getWorkModeConfig = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'remote':
        return { label: 'Remote', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'hybrid':
        return { label: 'Hybrid', bg: 'bg-sky-50 text-sky-700 border-sky-200' };
      case 'onsite':
      default:
        return { label: 'On-site', bg: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const getEmploymentTypeLabel = (type?: string) => {
    const map: Record<string, string> = {
      'full-time': 'Full-time',
      'part-time': 'Part-time',
      'contract': 'Contract',
      'internship': 'Internship',
      'freelance': 'Freelance',
    };
    return (type && map[type.toLowerCase()]) || type || 'Full-time';
  };

  const getExperienceLevelLabel = (lvl?: string) => {
    const map: Record<string, string> = {
      entry: 'Entry Level',
      mid: 'Mid Level',
      senior: 'Senior Level',
      lead: 'Lead / Exec',
    };
    return (lvl && map[lvl.toLowerCase()]) || lvl;
  };

  const workModeConfig = getWorkModeConfig(workMode);
  const effectiveMatchScore = matchScore || job.matchScore;

  // Format salary nicely
  const formatSalary = () => {
    if (salaryMin === undefined && salaryMax === undefined) return null;
    const formatNumber = (num: number) => num.toLocaleString();
    if (salaryMin !== undefined && salaryMax !== undefined && salaryMin !== salaryMax) {
      return `${salaryCurrency}${formatNumber(salaryMin)} – ${salaryCurrency}${formatNumber(salaryMax)}`;
    }
    if (salaryMin !== undefined) {
      return `From ${salaryCurrency}${formatNumber(salaryMin)}`;
    }
    if (salaryMax !== undefined) {
      return `Up to ${salaryCurrency}${formatNumber(salaryMax)}`;
    }
    return null;
  };

  const formattedSalary = formatSalary();

  const handleExternalApply = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (job.externalUrl) {
      window.open(job.externalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Company avatar fallback initials
  const initials = companyName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="group relative rounded-2xl bg-white border border-[#E2E8F0] p-6 shadow-xs job-card-interactive flex flex-col justify-between">
      <div>
        {/* Top bar: Company + Badges + Bookmark */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3.5 flex-1 min-w-0">
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={companyName}
                className="h-12 w-12 rounded-xl object-contain border border-[#F1F5F9] bg-white p-1 flex-shrink-0"
              />
            ) : (
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white font-bold flex items-center justify-center text-sm tracking-wider flex-shrink-0 shadow-xs">
                {initials || <Building2 className="h-5 w-5" />}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors truncate">
                  {companyName}
                </span>

                {isExternal ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200/80">
                    External · {job.sourceName || 'Adzuna'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-[#2563EB] border border-blue-200/80">
                    Workmark Direct
                  </span>
                )}

                {effectiveMatchScore !== undefined && effectiveMatchScore > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Sparkles className="h-3 w-3" />
                    {effectiveMatchScore}% Match
                  </span>
                )}
              </div>

              <Link to={`/jobs/${job._id}`} className="block group-hover:text-[#2563EB] transition-colors">
                <h3 className="text-base sm:text-lg font-bold text-[#0F172A] tracking-tight leading-snug line-clamp-1">
                  {job.title}
                </h3>
              </Link>
            </div>
          </div>

          {/* Bookmark toggle button */}
          <button
            type="button"
            onClick={handleSaveToggle}
            aria-label={saved ? 'Unsave job' : 'Save job'}
            className={`p-2 rounded-xl border transition-all duration-150 flex-shrink-0 ${
              saved
                ? 'bg-blue-50 border-blue-200 text-[#2563EB]'
                : 'border-transparent text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
            }`}
          >
            {saved ? (
              <BookmarkCheck className="h-5 w-5 fill-current text-[#2563EB]" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Location & Metadata Row (Country clearly visible) */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs text-[#475569] mb-4">
          {/* Location + Country flag */}
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-sm leading-none" title={countryDisplayName}>
              {countryFlag}
            </span>
            <span className="text-[#0F172A] font-semibold">{countryDisplayName}</span>
            {job.location && job.location !== countryDisplayName && (
              <span className="text-[#64748B]">· {job.location}</span>
            )}
          </div>

          {/* Work mode tag */}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${workModeConfig.bg}`}>
            {workModeConfig.label}
          </span>

          {/* Employment Type */}
          <span className="inline-flex items-center text-[#64748B]">
            <Briefcase className="h-3.5 w-3.5 mr-1 text-[#94A3B8]" />
            {getEmploymentTypeLabel(job.employmentType)}
          </span>

          {/* Experience level */}
          {job.experienceLevel && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#F1F5F9] text-[#475569]">
              {getExperienceLevelLabel(job.experienceLevel)}
            </span>
          )}

          {/* Salary when available */}
          {formattedSalary && (
            <span className="font-bold text-emerald-700 bg-emerald-50/80 px-2.5 py-0.5 rounded-md border border-emerald-200/60">
              {formattedSalary}
            </span>
          )}
        </div>

        {/* Skill tags */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {job.skills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="px-2.5 py-1 bg-[#F8FAFC] text-[#475569] text-xs font-medium rounded-lg border border-[#E2E8F0] hover:bg-[#F1F5F9] transition-colors"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="px-2 py-1 text-[#94A3B8] text-xs font-medium">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Posted time + Action CTA */}
      <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between gap-4">
        <div className="flex items-center text-xs text-[#64748B]">
          <Clock className="h-3.5 w-3.5 mr-1 text-[#94A3B8]" />
          <span>
            {job.createdAt
              ? `Posted ${formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}`
              : 'Recently posted'}
          </span>
        </div>

        {isExternal && job.externalUrl ? (
          <button
            type="button"
            onClick={handleExternalApply}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold transition-all duration-150 shadow-xs cursor-pointer"
          >
            <span>Apply on Company Site</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        ) : (
          <Link
            to={`/jobs/${job._id}`}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold transition-all duration-150 shadow-xs shadow-[#2563EB]/20"
          >
            <span>View Job</span>
          </Link>
        )}
      </div>
    </div>
  );
};
