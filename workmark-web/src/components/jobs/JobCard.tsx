import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Clock, Bookmark, BookmarkCheck, ExternalLink, Sparkles, Building2, TrendingUp, Info } from 'lucide-react';
import type { Job, OpportunityExplanation } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { useSaveJob, useUnsaveJob } from '../../hooks/useSavedJobs';
import { getCountryFlag, getCountryDisplayName } from '../../utils/countries';
import { OpportunityBreakdownModal } from './OpportunityBreakdownModal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface JobCardProps {
  job: Job;
  isSaved?: boolean;
  matchScore?: number;
  opportunityIntelligence?: OpportunityExplanation;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSaved = false,
  matchScore,
  opportunityIntelligence,
}) => {
  const [saved, setSaved] = useState(isSaved);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
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
  const salaryCurrency = job.salaryCurrency || job.salary?.currency || '₹';

  const workMode = job.workMode || 'onsite';
  const countryDisplayName = getCountryDisplayName(job.country || job.countryCode);
  const countryFlag = getCountryFlag(job.country || job.countryCode);

  const getWorkModeBadge = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'remote':
        return <Badge variant="success">Remote</Badge>;
      case 'hybrid':
        return <Badge variant="primary">Hybrid</Badge>;
      case 'onsite':
      default:
        return <Badge variant="default">On-site</Badge>;
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

  const intel = opportunityIntelligence || job.opportunityIntelligence;
  const effectiveMatchScore = matchScore || intel?.score || job.matchScore;

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
    <>
      <div className="genz-card p-6 flex flex-col justify-between group hover:scale-[1.01] transition-all">
        <div>
          {/* Top bar: Company + Badges + Bookmark */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-3.5 flex-1 min-w-0">
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="h-12 w-12 rounded-2xl object-contain border border-white/10 bg-slate-900 p-1 flex-shrink-0 shadow-sm"
                />
              ) : (
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-black flex items-center justify-center text-sm tracking-wider flex-shrink-0 shadow-sm">
                  {initials || <Building2 className="h-5 w-5" />}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-bold text-slate-400 hover:text-white transition-colors truncate">
                    {companyName}
                  </span>

                  {isExternal ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      External · {job.sourceName || 'Adzuna'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      Workmark Verified
                    </span>
                  )}

                  {effectiveMatchScore !== undefined && effectiveMatchScore > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (intel) setIsBreakdownOpen(true);
                      }}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black border transition-transform hover:scale-105 cursor-pointer ${
                        effectiveMatchScore >= 75
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : effectiveMatchScore >= 60
                          ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      }`}
                      title="Click to view Opportunity Intelligence Breakdown"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>{effectiveMatchScore}% Match</span>
                      {intel && <Info className="h-2.5 w-2.5 opacity-70 ml-0.5" />}
                    </button>
                  )}

                  {intel?.tags?.includes('Skill Stretch') && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      <TrendingUp className="h-2.5 w-2.5" />
                      Skill Stretch
                    </span>
                  )}
                </div>

                <Link to={`/jobs/${job._id}`} className="block group-hover:text-cyan-300 transition-colors">
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug line-clamp-1 group-hover:text-cyan-300">
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
              className={`p-2.5 rounded-2xl border transition-all flex-shrink-0 cursor-pointer ${
                saved
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400 shadow-sm'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {saved ? (
                <BookmarkCheck className="h-5 w-5 fill-current text-cyan-400" />
              ) : (
                <Bookmark className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Location & Metadata Row */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs font-semibold text-slate-400 mb-4">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <span className="text-sm leading-none" title={countryDisplayName}>
                {countryFlag}
              </span>
              <span>{countryDisplayName}</span>
              {job.location && job.location !== countryDisplayName && (
                <span className="text-slate-400 font-semibold">· {job.location}</span>
              )}
            </div>

            {getWorkModeBadge(workMode)}

            <span className="inline-flex items-center text-slate-300">
              <Briefcase className="h-3.5 w-3.5 mr-1 text-cyan-400" />
              {getEmploymentTypeLabel(job.employmentType)}
            </span>

            {job.experienceLevel && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold bg-slate-800/80 text-slate-300 border border-white/10">
                {getExperienceLevelLabel(job.experienceLevel)}
              </span>
            )}

            {formattedSalary && (
              <span className="font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
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
                  className="px-2.5 py-1 bg-slate-900/90 text-slate-300 text-xs font-bold rounded-xl border border-white/10 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 4 && (
                <span className="px-2 py-1 text-slate-400 text-xs font-bold">
                  +{job.skills.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4">
          <div className="flex items-center text-xs font-semibold text-slate-400">
            <Clock className="h-3.5 w-3.5 mr-1 text-cyan-400" />
            <span>
              {job.createdAt
                ? `Posted ${formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}`
                : 'Recently posted'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {intel && (
              <button
                type="button"
                onClick={() => setIsBreakdownOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 text-xs font-black transition-all cursor-pointer shadow-xs"
              >
                <Sparkles className="h-3 w-3 text-cyan-400" />
                <span>Intel</span>
              </button>
            )}

            {isExternal && job.externalUrl ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExternalApply}
                className="text-xs border-white/10 bg-slate-900 hover:bg-slate-800 text-slate-200"
              >
                <span>Apply External</span>
                <ExternalLink className="h-3 w-3 ml-1.5" />
              </Button>
            ) : (
              <Link to={`/jobs/${job._id}`}>
                <Button variant="primary" size="sm" className="text-xs genz-btn-primary">
                  <span>View Role</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {intel && (
        <OpportunityBreakdownModal
          isOpen={isBreakdownOpen}
          onClose={() => setIsBreakdownOpen(false)}
          jobTitle={job.title}
          companyName={companyName}
          intel={intel}
          isExternal={isExternal}
        />
      )}
    </>
  );
};
