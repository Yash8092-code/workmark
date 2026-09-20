import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getCountryDisplayName, getCountryFlag } from '../../utils/countries';
import { Compass, Sparkles, Globe, MapPin, ArrowRight } from 'lucide-react';
import type { JobFilters } from '../../types';

interface OpportunityRadarProps {
  currentFilters: JobFilters;
  onApplyPreset: (preset: Partial<JobFilters>) => void;
  className?: string;
}

export const OpportunityRadar: React.FC<OpportunityRadarProps> = ({
  currentFilters,
  onApplyPreset,
  className = '',
}) => {
  const { user, isAuthenticated } = useAuth();

  const userCountryCode = user?.countryCode || currentFilters.country || 'in';
  const countryName = getCountryDisplayName(userCountryCode);
  const countryFlag = getCountryFlag(userCountryCode);

  const preferredCategories = user?.jobAlertPreferences?.categories || ['Software Development', 'Design', 'Product Management'];
  const hasRemoteFilter = currentFilters.workMode?.includes('remote');
  const isTargetingCountry = currentFilters.country && currentFilters.country !== 'all';

  return (
    <div className={`clay-card-dark p-6 sm:p-7 relative overflow-hidden ${className}`}>
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-[#6C5CE7]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Radar Signal Overview */}
        <div className="flex items-start gap-4">
          <div className="relative h-12 w-12 rounded-2xl bg-[#6C5CE7]/30 border border-[#6C5CE7]/40 flex items-center justify-center text-[#8ED8FF] flex-shrink-0">
            <Compass className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#35C98A] border-2 border-[#1E1C2E] animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#8ED8FF] flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-[#FFB84D]" />
                <span>Opportunity Radar</span>
              </span>
              <span className="text-white/30 text-xs">•</span>
              <span className="text-xs text-white/80 font-bold flex items-center gap-1">
                <span>{countryFlag}</span>
                <span>{countryName}</span>
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight mb-1.5">
              {isAuthenticated ? (
                <span>Tuned for {user?.name.split(' ')[0]}'s Career Trajectory</span>
              ) : (
                <span>Intelligent Career Discovery</span>
              )}
            </h3>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-xl">
              Deterministic scoring calibrated from your location, role competencies, and verified remote openings.
            </p>
          </div>
        </div>

        {/* Right: Quick Discovery Presets */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick preset 1: Top in My Country */}
          <button
            type="button"
            onClick={() => onApplyPreset({ country: userCountryCode, workMode: undefined })}
            className={`px-3.5 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center gap-1.5 ${
              isTargetingCountry && !hasRemoteFilter
                ? 'bg-[#6C5CE7] border-[#6C5CE7] text-white shadow-lg shadow-[#6C5CE7]/30 scale-105'
                : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
            }`}
          >
            <MapPin className="h-3.5 w-3.5 text-[#8ED8FF]" />
            <span>{countryName} Only</span>
          </button>

          {/* Quick preset 2: Remote Global */}
          <button
            type="button"
            onClick={() => onApplyPreset({ workMode: ['remote'], country: undefined })}
            className={`px-3.5 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center gap-1.5 ${
              hasRemoteFilter
                ? 'bg-[#35C98A] border-[#35C98A] text-white shadow-lg shadow-[#35C98A]/30 scale-105'
                : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
            }`}
          >
            <Globe className="h-3.5 w-3.5 text-[#35C98A]" />
            <span>Remote Worldwide</span>
          </button>

          {/* Quick preset 3: Top Preferred Domain */}
          {preferredCategories.length > 0 && (
            <button
              type="button"
              onClick={() => onApplyPreset({ category: preferredCategories[0] })}
              className={`px-3.5 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center gap-1.5 ${
                currentFilters.category?.toLowerCase() === preferredCategories[0].toLowerCase()
                  ? 'bg-[#5146C7] border-[#5146C7] text-white shadow-lg shadow-[#5146C7]/30 scale-105'
                  : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
              }`}
            >
              <span>{preferredCategories[0]}</span>
              <ArrowRight className="h-3 w-3 text-white/80" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
