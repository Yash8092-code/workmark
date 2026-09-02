import React from 'react';
import { getCountryByCode } from '../../utils/countries';

export type DiscoveryMode = 'my_country' | 'worldwide';

interface DiscoveryModeBadgeProps {
  mode: DiscoveryMode;
  userCountryCode?: string;
  userCountryName?: string;
  onModeChange: (mode: DiscoveryMode) => void;
  className?: string;
}

export const DiscoveryModeBadge: React.FC<DiscoveryModeBadgeProps> = ({
  mode,
  userCountryCode,
  userCountryName,
  onModeChange,
  className = '',
}) => {
  const countryObj = getCountryByCode(userCountryCode);
  const countryFlag = countryObj?.flag || '📍';
  const countryDisplayName = countryObj?.name || userCountryName || 'My Country';

  return (
    <div
      className={`inline-flex p-1 rounded-2xl bg-[#F1F5F9] border border-[#E2E8F0] shadow-xs ${className}`}
      role="tablist"
      aria-label="Job Discovery Mode"
    >
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'my_country'}
        onClick={() => onModeChange('my_country')}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
          mode === 'my_country'
            ? 'bg-white text-[#0F172A] shadow-sm ring-1 ring-black/5 font-bold'
            : 'text-[#64748B] hover:text-[#0F172A] hover:bg-white/50'
        }`}
      >
        <span className="text-base leading-none">{countryFlag}</span>
        <span>Jobs in {countryDisplayName}</span>
        {mode === 'my_country' && (
          <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-subtle-pulse" />
        )}
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={mode === 'worldwide'}
        onClick={() => onModeChange('worldwide')}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
          mode === 'worldwide'
            ? 'bg-white text-[#0F172A] shadow-sm ring-1 ring-black/5 font-bold'
            : 'text-[#64748B] hover:text-[#0F172A] hover:bg-white/50'
        }`}
      >
        <span className="text-base leading-none">🌎</span>
        <span>Explore Worldwide</span>
        {mode === 'worldwide' && (
          <span className="h-2 w-2 rounded-full bg-[#2563EB] animate-subtle-pulse" />
        )}
      </button>
    </div>
  );
};
