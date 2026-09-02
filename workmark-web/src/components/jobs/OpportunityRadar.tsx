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

  const preferredCategories = user?.jobAlertPreferences?.categories || ['Engineering', 'Design', 'Product'];
  const hasRemoteFilter = currentFilters.workMode?.includes('remote');
  const isTargetingCountry = currentFilters.country && currentFilters.country !== 'all';

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white p-6 sm:p-7 border border-white/10 shadow-xl shadow-[#0F172A]/15 ${className}`}>
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Radar Signal Overview */}
        <div className="flex items-start gap-4">
          <div className="relative h-12 w-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 flex-shrink-0">
            <Compass className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#0F172A] animate-subtle-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                <span>Opportunity Radar</span>
              </span>
              <span className="text-white/30 text-xs">•</span>
              <span className="text-xs text-slate-300 font-medium flex items-center gap-1">
                <span>{countryFlag}</span>
                <span>{countryName}</span>
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-tight mb-1.5">
              {isAuthenticated ? (
                <span>Tuned for {user?.name.split(' ')[0]}'s Profile</span>
              ) : (
                <span>Intelligent Career Discovery</span>
              )}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Signals derived from your location preferences, target roles, and remote opportunities across verified platforms.
            </p>
          </div>
        </div>

        {/* Right: Quick Discovery Presets */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick preset 1: Top in My Country */}
          <button
            type="button"
            onClick={() => onApplyPreset({ country: userCountryCode, workMode: undefined })}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              isTargetingCountry && !hasRemoteFilter
                ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/30'
                : 'bg-white/10 hover:bg-white/15 border-white/10 text-slate-200 hover:text-white'
            }`}
          >
            <MapPin className="h-3.5 w-3.5 text-blue-400" />
            <span>{countryName} Only</span>
          </button>

          {/* Quick preset 2: Remote Global */}
          <button
            type="button"
            onClick={() => onApplyPreset({ workMode: ['remote'], country: undefined })}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              hasRemoteFilter
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-600/30'
                : 'bg-white/10 hover:bg-white/15 border-white/10 text-slate-200 hover:text-white'
            }`}
          >
            <Globe className="h-3.5 w-3.5 text-emerald-400" />
            <span>Remote Anywhere</span>
          </button>

          {/* Quick preset 3: Top Preferred Domain */}
          {preferredCategories.length > 0 && (
            <button
              type="button"
              onClick={() => onApplyPreset({ category: preferredCategories[0] })}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                currentFilters.category?.toLowerCase() === preferredCategories[0].toLowerCase()
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-white/10 hover:bg-white/15 border-white/10 text-slate-200 hover:text-white'
              }`}
            >
              <span>{preferredCategories[0]}</span>
              <ArrowRight className="h-3 w-3 text-slate-300" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
