import React from 'react';
import { Input } from '../ui/Input';
import { CountrySelector } from '../ui/CountrySelector';
import type { JobFilters as JobFiltersType, EmploymentType, WorkMode, ExperienceLevel } from '../../types';
import { getSuggestedCities } from '../../utils/countries';
import {
  RotateCcw,
  SlidersHorizontal,
  MapPin,
  Briefcase,
  DollarSign,
  Layers,
  Calendar,
  Building,
} from 'lucide-react';

interface JobFiltersProps {
  filters: JobFiltersType;
  onFiltersChange: (filters: JobFiltersType) => void;
  onClear: () => void;
  className?: string;
}

export const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  onFiltersChange,
  onClear,
  className = '',
}) => {
  const updateFilter = (key: keyof JobFiltersType, value: unknown) => {
    onFiltersChange({ ...filters, [key]: value } as JobFiltersType);
  };

  const toggleArrayFilter = <T extends string>(
    key: 'employmentType' | 'workMode' | 'experienceLevel',
    value: T
  ) => {
    const currentArray = ((filters[key] as unknown as string[]) || []) as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray.length > 0 ? newArray : undefined);
  };

  // Accurate active filters count
  const activeCount = [
    filters.city || filters.location,
    filters.country && filters.country !== 'all' ? filters.country : undefined,
    filters.category,
    filters.source && filters.source !== 'all' ? filters.source : undefined,
    filters.employmentType?.length,
    filters.workMode?.length,
    filters.experienceLevel?.length,
    filters.salaryMin || filters.salaryMax || filters.salaryDisclosed,
    filters.datePosted,
  ].filter(Boolean).length;

  const categories = [
    'Software Development',
    'Data Science',
    'Design',
    'Marketing',
    'Sales',
    'Finance',
    'Human Resources',
    'Customer Support',
    'Product Management',
    'Operations',
  ];

  const employmentTypes: { value: EmploymentType; label: string }[] = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'freelance', label: 'Freelance' },
  ];

  const workModes: { value: WorkMode; label: string; icon: string }[] = [
    { value: 'remote', label: 'Remote', icon: '🌐' },
    { value: 'hybrid', label: 'Hybrid', icon: '🏢' },
    { value: 'onsite', label: 'On-site', icon: '📍' },
  ];

  const experienceLevels: { value: ExperienceLevel; label: string }[] = [
    { value: 'entry', label: 'Entry Level (0-2 yrs)' },
    { value: 'mid', label: 'Mid Level (2-5 yrs)' },
    { value: 'senior', label: 'Senior Level (5-8 yrs)' },
    { value: 'lead', label: 'Lead / Executive (8+ yrs)' },
  ];

  const suggestedCities = getSuggestedCities(filters.country);

  return (
    <div className={`clay-card p-6 space-y-6 ${className}`}>
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E6E8F2]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[#6C5CE7]" />
          <h3 className="font-black text-[#25243A] text-base">Filter Vacancies</h3>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-black bg-[#6C5CE7] text-white shadow-xs">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#7E7C9A] hover:text-[#FF6B81] transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Target Country */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-[#7E7C9A] mb-2 flex items-center justify-between">
          <span>Target Country</span>
          {filters.country && filters.country !== 'all' && (
            <button
              type="button"
              onClick={() => updateFilter('country', undefined)}
              className="text-[11px] font-bold text-[#6C5CE7] hover:underline"
            >
              Reset to Worldwide
            </button>
          )}
        </label>
        <CountrySelector
          value={filters.country || 'all'}
          onChange={(code) => updateFilter('country', code === 'all' ? undefined : code)}
          allowAll={true}
          allLabel="Worldwide (All Countries)"
          placeholder="Filter by country..."
          size="sm"
        />
      </div>

      {/* City / Region Search + Quick Suggestions */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-[#7E7C9A] mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#6C5CE7]" />
            <span>City or Location</span>
          </span>
          {(filters.city || filters.location) && (
            <button
              type="button"
              onClick={() => {
                onFiltersChange({ ...filters, city: undefined, location: undefined });
              }}
              className="text-[11px] font-bold text-[#6C5CE7] hover:underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </label>
        <Input
          type="text"
          placeholder="e.g. Bengaluru, London, Berlin..."
          value={filters.city || filters.location || ''}
          onChange={(e) => {
            const val = e.target.value || undefined;
            onFiltersChange({ ...filters, city: val, location: val });
          }}
          className="text-xs"
        />
        {/* Dynamic city suggestions based on country */}
        {suggestedCities.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {suggestedCities.slice(0, 5).map((cityName) => {
              const isSelected = (filters.city || filters.location)?.toLowerCase() === cityName.toLowerCase();
              return (
                <button
                  key={cityName}
                  type="button"
                  onClick={() => {
                    const nextVal = isSelected ? undefined : cityName;
                    onFiltersChange({ ...filters, city: nextVal, location: nextVal });
                  }}
                  className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#6C5CE7] text-white border-[#6C5CE7] shadow-xs'
                      : 'bg-[#F7F7FB] text-[#7E7C9A] border-[#E6E8F2] hover:bg-[#EDE9FE]/50 hover:text-[#6C5CE7]'
                  }`}
                >
                  {cityName}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Work Mode Filter */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-[#7E7C9A] mb-2.5">
          Work Mode
        </label>
        <div className="grid grid-cols-3 gap-2">
          {workModes.map((mode) => {
            const isSelected = filters.workMode?.includes(mode.value);
            return (
              <button
                key={mode.value}
                type="button"
                onClick={() => toggleArrayFilter('workMode', mode.value)}
                className={`py-2 px-2 rounded-xl text-xs font-bold border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#EDE9FE] border-[#6C5CE7] text-[#6C5CE7] shadow-sm scale-105'
                    : 'bg-[#F7F7FB] border-[#E6E8F2] text-[#7E7C9A] hover:border-[#6C5CE7] hover:text-[#25243A]'
                }`}
              >
                <span className="text-base leading-none">{mode.icon}</span>
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Job Category */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-[#7E7C9A] mb-2 flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-[#6C5CE7]" />
          <span>Category</span>
        </label>
        <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => updateFilter('category', undefined)}
            className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              !filters.category
                ? 'bg-[#25243A] text-white border-[#25243A] shadow-sm'
                : 'bg-[#F7F7FB] text-[#7E7C9A] border-[#E6E8F2] hover:bg-white hover:text-[#25243A]'
            }`}
          >
            All
          </button>
          {categories.map((cat) => {
            const isSelected = filters.category?.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => updateFilter('category', isSelected ? undefined : cat)}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#6C5CE7] text-white border-[#6C5CE7] shadow-sm'
                    : 'bg-[#F7F7FB] text-[#7E7C9A] border-[#E6E8F2] hover:bg-white hover:text-[#25243A]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Employment Type */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-[#7E7C9A] mb-2 flex items-center gap-1.5">
          <Briefcase className="h-3.5 w-3.5 text-[#6C5CE7]" />
          <span>Employment Type</span>
        </label>
        <div className="space-y-1.5">
          {employmentTypes.map((type) => {
            const isChecked = filters.employmentType?.includes(type.value) || false;
            return (
              <label
                key={type.value}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-[#EDE9FE]/30 cursor-pointer text-xs font-bold text-[#25243A] transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleArrayFilter('employmentType', type.value)}
                  className="h-4 w-4 text-[#6C5CE7] border-[#E6E8F2] rounded focus:ring-[#6C5CE7] cursor-pointer"
                />
                <span>{type.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-[#7E7C9A] mb-2">
          Experience Level
        </label>
        <div className="space-y-1.5">
          {experienceLevels.map((lvl) => {
            const isChecked = filters.experienceLevel?.includes(lvl.value) || false;
            return (
              <label
                key={lvl.value}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-[#EDE9FE]/30 cursor-pointer text-xs font-bold text-[#25243A] transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleArrayFilter('experienceLevel', lvl.value)}
                  className="h-4 w-4 text-[#6C5CE7] border-[#E6E8F2] rounded focus:ring-[#6C5CE7] cursor-pointer"
                />
                <span>{lvl.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Salary Filter */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-[#7E7C9A] mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-[#6C5CE7]" />
            <span>Compensation</span>
          </span>
          <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-[#7E7C9A]">
            <input
              type="checkbox"
              checked={filters.salaryDisclosed || false}
              onChange={(e) => updateFilter('salaryDisclosed', e.target.checked || undefined)}
              className="h-3.5 w-3.5 text-[#6C5CE7] rounded border-[#E6E8F2]"
            />
            <span>Disclosed only</span>
          </label>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.salaryMin || ''}
            onChange={(e) => updateFilter('salaryMin', e.target.value ? Number(e.target.value) : undefined)}
            className="text-xs"
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.salaryMax || ''}
            onChange={(e) => updateFilter('salaryMax', e.target.value ? Number(e.target.value) : undefined)}
            className="text-xs"
          />
        </div>
      </div>

      {/* Source Selection */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-[#7E7C9A] mb-2 flex items-center gap-1.5">
          <Building className="h-3.5 w-3.5 text-[#6C5CE7]" />
          <span>Job Source</span>
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { value: undefined, label: 'All' },
            { value: 'workmark', label: 'Workmark' },
            { value: 'adzuna', label: 'External' },
          ].map((src) => {
            const isSelected = (filters.source || undefined) === src.value;
            return (
              <button
                key={src.label}
                type="button"
                onClick={() => updateFilter('source', src.value)}
                className={`py-2 px-2 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#6C5CE7] text-white border-[#6C5CE7] shadow-sm'
                    : 'bg-[#F7F7FB] border-[#E6E8F2] text-[#7E7C9A] hover:bg-white hover:text-[#25243A]'
                }`}
              >
                {src.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Posted */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-[#7E7C9A] mb-2 flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-[#6C5CE7]" />
          <span>Date Posted</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { value: undefined, label: 'Any time' },
            { value: '24h', label: 'Past 24 hours' },
            { value: '3d', label: 'Past 3 days' },
            { value: '7d', label: 'Past week' },
            { value: '30d', label: 'Past month' },
          ].map((item) => {
            const isSelected = filters.datePosted === item.value;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => updateFilter('datePosted', item.value)}
                className={`py-2 px-2 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#25243A] text-white border-[#25243A] shadow-sm'
                    : 'bg-[#F7F7FB] border-[#E6E8F2] text-[#7E7C9A] hover:bg-white hover:text-[#25243A]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
