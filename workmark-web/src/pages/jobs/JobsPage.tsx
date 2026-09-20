import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { JobCard } from '../../components/jobs/JobCard';
import { JobFilters } from '../../components/jobs/JobFilters';
import { JobSearch } from '../../components/jobs/JobSearch';
import { DiscoveryModeBadge, type DiscoveryMode } from '../../components/jobs/DiscoveryModeBadge';
import { CountrySetupPrompt } from '../../components/ui/CountrySetupPrompt';
import { OpportunityRadar } from '../../components/jobs/OpportunityRadar';
import { Pagination } from '../../components/ui/Pagination';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { useJobs } from '../../hooks/useJobs';
import { useAuth } from '../../hooks/useAuth';
import type { JobFilters as JobFiltersType, EmploymentType, WorkMode, ExperienceLevel } from '../../types';
import { getCountryByCode, getCountryDisplayName, getCountryFlag } from '../../utils/countries';
import {
  Briefcase,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Globe,
  RotateCcw,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const JobsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Helper to parse comma-separated URL params into typed arrays
  const parseUrlArray = <T extends string>(key: string): T[] | undefined => {
    const val = searchParams.get(key);
    if (!val) return undefined;
    const items = val.split(',').map((s) => s.trim()) as T[];
    return items.length > 0 ? items : undefined;
  };

  // Derive initial country from user preference or URL param
  const urlCountry = searchParams.get('country');
  const userCountry = user?.countryCode || 'in';

  // Discovery Mode: 'my_country' or 'worldwide'
  const [discoveryMode, setDiscoveryMode] = useState<DiscoveryMode>(
    urlCountry === 'all' ? 'worldwide' : 'my_country'
  );

  // Parse all initial filter state from URL
  const filters: JobFiltersType = useMemo(() => {
    return {
      search: searchParams.get('search') || searchParams.get('keyword') || undefined,
      keyword: searchParams.get('keyword') || searchParams.get('search') || undefined,
      location: searchParams.get('location') || searchParams.get('city') || undefined,
      city: searchParams.get('city') || searchParams.get('location') || undefined,
      category: searchParams.get('category') || undefined,
      country: urlCountry === 'all' ? undefined : (urlCountry || (discoveryMode === 'my_country' ? userCountry : undefined)),
      employmentType: parseUrlArray<EmploymentType>('employmentType'),
      workMode: parseUrlArray<WorkMode>('workMode'),
      experienceLevel: parseUrlArray<ExperienceLevel>('experienceLevel'),
      salaryMin: searchParams.get('salaryMin') ? Number(searchParams.get('salaryMin')) : undefined,
      salaryMax: searchParams.get('salaryMax') ? Number(searchParams.get('salaryMax')) : undefined,
      salaryDisclosed: searchParams.get('salaryDisclosed') === 'true' ? true : undefined,
      source: (searchParams.get('source') as 'all' | 'workmark' | 'adzuna') || undefined,
      datePosted: searchParams.get('datePosted') || undefined,
    };
  }, [searchParams, urlCountry, discoveryMode, userCountry]);

  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const sortParam = searchParams.get('sort') || 'recommended';

  // Function to serialize filter state to URL search params
  const updateUrlParams = useCallback((newFilters: JobFiltersType, newPage = 1, newSort = sortParam) => {
    const params = new URLSearchParams();

    if (newFilters.keyword || newFilters.search) {
      params.set('keyword', (newFilters.keyword || newFilters.search)!);
    }
    if (newFilters.city || newFilters.location) {
      params.set('city', (newFilters.city || newFilters.location)!);
    }
    if (newFilters.category) {
      params.set('category', newFilters.category);
    }
    if (newFilters.country) {
      params.set('country', newFilters.country);
    } else if (discoveryMode === 'worldwide') {
      params.set('country', 'all');
    }
    if (newFilters.employmentType && newFilters.employmentType.length > 0) {
      params.set('employmentType', newFilters.employmentType.join(','));
    }
    if (newFilters.workMode && newFilters.workMode.length > 0) {
      params.set('workMode', newFilters.workMode.join(','));
    }
    if (newFilters.experienceLevel && newFilters.experienceLevel.length > 0) {
      params.set('experienceLevel', newFilters.experienceLevel.join(','));
    }
    if (newFilters.salaryMin !== undefined) {
      params.set('salaryMin', String(newFilters.salaryMin));
    }
    if (newFilters.salaryMax !== undefined) {
      params.set('salaryMax', String(newFilters.salaryMax));
    }
    if (newFilters.salaryDisclosed) {
      params.set('salaryDisclosed', 'true');
    }
    if (newFilters.source && newFilters.source !== 'all') {
      params.set('source', newFilters.source);
    }
    if (newFilters.datePosted) {
      params.set('datePosted', newFilters.datePosted);
    }
    if (newSort && newSort !== 'recommended') {
      params.set('sort', newSort);
    }
    if (newPage > 1) {
      params.set('page', String(newPage));
    }

    setSearchParams(params, { replace: true });
  }, [discoveryMode, sortParam, setSearchParams]);

  // Sync user country change into URL if on default my_country mode and no URL override
  useEffect(() => {
    if (user?.countryCode && discoveryMode === 'my_country' && !searchParams.get('country')) {
      updateUrlParams({ ...filters, country: user.countryCode }, 1);
    }
  }, [user?.countryCode]);

  // Query jobs
  const { data, isLoading, isError, refetch } = useJobs({
    ...filters,
    page,
    limit: 12,
    sort: sortParam,
  });

  const activeCountryCode = filters.country && filters.country !== 'all' ? filters.country : user?.countryCode;
  const activeCountryObj = getCountryByCode(activeCountryCode);
  const activeCountryName = activeCountryObj?.name || getCountryDisplayName(activeCountryCode) || 'your region';
  const activeCountryFlag = activeCountryObj?.flag || getCountryFlag(activeCountryCode);

  const handleDiscoveryModeChange = (mode: DiscoveryMode) => {
    setDiscoveryMode(mode);
    if (mode === 'my_country') {
      const targetCountry = user?.countryCode || 'in';
      updateUrlParams({ ...filters, country: targetCountry }, 1);
    } else {
      updateUrlParams({ ...filters, country: undefined }, 1);
    }
  };

  const handleSearch = (keyword: string, location: string, country: string) => {
    const isWorldwide = country === 'all' || !country;
    setDiscoveryMode(isWorldwide ? 'worldwide' : 'my_country');
    updateUrlParams(
      {
        ...filters,
        keyword: keyword || undefined,
        search: keyword || undefined,
        location: location || undefined,
        city: location || undefined,
        country: isWorldwide ? undefined : country,
      },
      1
    );
  };

  const handleFiltersChange = (newFilters: JobFiltersType) => {
    updateUrlParams(newFilters, 1);
  };

  const handleClearFilters = () => {
    const defaultCountry = discoveryMode === 'my_country' ? (user?.countryCode || 'in') : undefined;
    updateUrlParams({ country: defaultCountry }, 1);
  };

  const handleRemoveFilter = (key: keyof JobFiltersType, specificValue?: string) => {
    if (key === 'city' || key === 'location') {
      updateUrlParams({ ...filters, city: undefined, location: undefined }, 1);
      return;
    }
    if (key === 'search' || key === 'keyword') {
      updateUrlParams({ ...filters, search: undefined, keyword: undefined }, 1);
      return;
    }
    if (key === 'salaryMin' || key === 'salaryMax') {
      updateUrlParams({ ...filters, salaryMin: undefined, salaryMax: undefined }, 1);
      return;
    }
    if (specificValue && Array.isArray(filters[key])) {
      const currentList = (filters[key] as unknown as string[]) || [];
      const updatedList = currentList.filter((item) => item !== specificValue);
      updateUrlParams({ ...filters, [key]: updatedList.length > 0 ? updatedList : undefined }, 1);
    } else {
      updateUrlParams({ ...filters, [key]: undefined }, 1);
    }
  };

  const totalCount = data?.pagination?.total || 0;

  // Active filter chips list for quick deletion
  const activeFilterChips = useMemo(() => {
    const chips: { label: string; onRemove: () => void }[] = [];

    if (filters.keyword) {
      chips.push({
        label: `Keyword: "${filters.keyword}"`,
        onRemove: () => handleRemoveFilter('keyword'),
      });
    }
    if (filters.city || filters.location) {
      chips.push({
        label: `Location: ${filters.city || filters.location}`,
        onRemove: () => handleRemoveFilter('city'),
      });
    }
    if (filters.country && filters.country !== 'all') {
      const c = getCountryByCode(filters.country);
      chips.push({
        label: `${c?.flag || '📍'} ${c?.name || filters.country.toUpperCase()}`,
        onRemove: () => handleRemoveFilter('country'),
      });
    }
    if (filters.category) {
      chips.push({
        label: `Category: ${filters.category}`,
        onRemove: () => handleRemoveFilter('category'),
      });
    }
    filters.workMode?.forEach((wm) => {
      chips.push({
        label: `Mode: ${wm}`,
        onRemove: () => handleRemoveFilter('workMode', wm),
      });
    });
    filters.employmentType?.forEach((et) => {
      chips.push({
        label: `Type: ${et}`,
        onRemove: () => handleRemoveFilter('employmentType', et),
      });
    });
    filters.experienceLevel?.forEach((el) => {
      chips.push({
        label: `Exp: ${el}`,
        onRemove: () => handleRemoveFilter('experienceLevel', el),
      });
    });
    if (filters.salaryMin || filters.salaryMax) {
      chips.push({
        label: `Salary: ${filters.salaryMin ? `₹${filters.salaryMin}` : '₹0'} – ${filters.salaryMax ? `₹${filters.salaryMax}` : 'Max'}`,
        onRemove: () => handleRemoveFilter('salaryMin'),
      });
    }
    if (filters.salaryDisclosed) {
      chips.push({
        label: `Salary Disclosed`,
        onRemove: () => handleRemoveFilter('salaryDisclosed'),
      });
    }
    if (filters.source && filters.source !== 'all') {
      chips.push({
        label: `Source: ${filters.source === 'workmark' ? 'Workmark' : 'External'}`,
        onRemove: () => handleRemoveFilter('source'),
      });
    }
    if (filters.datePosted) {
      chips.push({
        label: `Posted: ${filters.datePosted}`,
        onRemove: () => handleRemoveFilter('datePosted'),
      });
    }

    return chips;
  }, [filters]);

  return (
    <PublicLayout>
      <div className="min-h-screen pb-16 animate-fadeIn">
        {/* Top Search Hero */}
        <div className="py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-6">
              <h1 className="text-3xl sm:text-4xl font-black text-[#25243A] tracking-tight">
                Find Opportunities That Fit You
              </h1>
              <p className="mt-2 text-sm font-semibold text-[#7E7C9A]">
                Discover personalized roles in{' '}
                <span className="font-bold text-[#6C5CE7]">
                  {activeCountryFlag} {activeCountryName}
                </span>{' '}
                and worldwide
              </p>
            </div>

            <JobSearch
              initialKeyword={filters.keyword || filters.search}
              initialLocation={filters.city || filters.location}
              initialCountry={filters.country || (discoveryMode === 'worldwide' ? 'all' : '')}
              onSearch={handleSearch}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Prompt for existing users with no countryCode set */}
          {isAuthenticated && !user?.countryCode && (
            <CountrySetupPrompt
              onSaved={(newCode) => {
                setDiscoveryMode('my_country');
                updateUrlParams({ ...filters, country: newCode }, 1);
              }}
              className="mb-8"
            />
          )}

          {/* Discovery Mode Switcher & Personalization Header */}
          <div className="clay-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <DiscoveryModeBadge
                mode={discoveryMode}
                userCountryCode={user?.countryCode || 'in'}
                userCountryName={user?.countryName || 'India'}
                onModeChange={handleDiscoveryModeChange}
              />
            </div>

            <div className="flex items-center gap-3 text-xs text-[#7E7C9A] font-semibold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#6C5CE7]" />
                {discoveryMode === 'my_country' ? (
                  <span>
                    Prioritizing vacancies in{' '}
                    <strong className="text-[#25243A]">
                      {activeCountryFlag} {activeCountryName}
                    </strong>
                  </span>
                ) : (
                  <span>
                    Showing opportunities from <strong className="text-[#25243A]">All Countries</strong>
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Opportunity Radar Widget */}
          <OpportunityRadar
            currentFilters={filters}
            onApplyPreset={(preset) => updateUrlParams({ ...filters, ...preset }, 1)}
            className="mb-8"
          />

          {/* Active Filter Chips */}
          {activeFilterChips.length > 0 && (
            <div className="clay-card-soft p-3 mb-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-black text-[#7E7C9A] uppercase tracking-wider mr-1">
                Active Filters ({activeFilterChips.length}):
              </span>
              {activeFilterChips.map((chip, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-[#EDE9FE] text-[#6C5CE7] border border-[#DDD6FE]"
                >
                  <span>{chip.label}</span>
                  <button
                    type="button"
                    onClick={chip.onRemove}
                    className="hover:text-red-600 transition-colors cursor-pointer"
                    aria-label={`Remove filter ${chip.label}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-bold text-[#FF6B81] hover:underline ml-auto cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Desktop */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24">
                <JobFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClear={handleClearFilters}
                />
              </div>
            </aside>

            {/* Mobile Filter Trigger Button */}
            <div className="lg:hidden">
              <Button
                variant="secondary"
                onClick={() => setIsMobileFilterOpen(true)}
                className="w-full justify-center"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2 text-[#6C5CE7]" />
                Filter Opportunities {activeFilterChips.length > 0 && `(${activeFilterChips.length})`}
              </Button>
            </div>

            {/* Mobile Filter Drawer */}
            {isMobileFilterOpen && (
              <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
                <div
                  className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
                  onClick={() => setIsMobileFilterOpen(false)}
                />
                <div className="relative z-10 w-full max-w-sm bg-[#0E1526] border-l border-white/10 overflow-y-auto shadow-2xl p-6 flex flex-col justify-between h-full text-slate-100">
                  <div>
                    <div className="pb-4 border-b border-white/10 flex items-center justify-between mb-4">
                      <h2 className="text-lg font-black text-white">Filters</h2>
                      <button
                        type="button"
                        onClick={() => setIsMobileFilterOpen(false)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <JobFilters
                      filters={filters}
                      onFiltersChange={handleFiltersChange}
                      onClear={handleClearFilters}
                    />
                  </div>
                  <Button
                    variant="primary"
                    className="w-full mt-6 genz-btn-primary"
                    onClick={() => setIsMobileFilterOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            )}

            {/* Main Content: Jobs List */}
            <div className="flex-1 min-w-0">
              {/* Header Bar with Sorting & Results Count */}
              <div className="genz-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                    <span>{discoveryMode === 'my_country' ? 'Vacancies for You' : 'Global Opportunities'}</span>
                    {!isLoading && totalCount > 0 && (
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
                        {totalCount > 100 ? '100+' : totalCount} available
                      </span>
                    )}
                  </h2>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">
                    {discoveryMode === 'my_country'
                      ? `Tailored to your location in ${activeCountryName}`
                      : 'Browsing verified positions worldwide'}
                  </p>
                </div>

                {/* Sort selector */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <ArrowUpDown className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="text-xs font-bold text-slate-400">Sort:</span>
                  <select
                    value={sortParam}
                    onChange={(e) => updateUrlParams(filters, 1, e.target.value)}
                    className="text-xs font-bold text-slate-100 bg-slate-900 border border-white/15 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-400 cursor-pointer shadow-xs"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="newest">Newest First</option>
                    <option value="salary_high">Salary: High to Low</option>
                    <option value="salary_low">Salary: Low to High</option>
                    <option value="title-asc">Title: A to Z</option>
                  </select>
                </div>
              </div>

              {/* Error State */}
              {isError && (
                <div className="clay-card p-6 text-center mb-6 bg-[#FFF1F2] border border-[#FFE4E6]">
                  <p className="text-sm font-bold text-[#E11D48] mb-2">
                    We're having trouble refreshing job listings right now.
                  </p>
                  <p className="text-xs text-[#E11D48] mb-4">
                    Please check your connection or try again in a moment.
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => refetch()}>
                    Try Again
                  </Button>
                </div>
              )}

              {/* Loading State */}
              {isLoading ? (
                <div className="grid grid-cols-1 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : data?.data?.length === 0 ? (
                /* Personalized Empty State */
                <div className="clay-card p-8 sm:p-12 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-[#EDE9FE] text-[#6C5CE7] flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-black text-[#25243A] mb-1">No matching jobs found</h3>
                  <p className="text-sm font-medium text-[#7E7C9A] max-w-md mx-auto mb-6 leading-relaxed">
                    {discoveryMode === 'my_country'
                      ? `We couldn't find matching jobs in ${activeCountryName} right now with the active filters. Try broadening your criteria or explore worldwide opportunities.`
                      : 'No jobs matched your current filter criteria. Try adjusting keywords or clearing specific constraints.'}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleClearFilters}
                    >
                      <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                      Clear Filters
                    </Button>

                    {discoveryMode === 'my_country' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleDiscoveryModeChange('worldwide')}
                      >
                        <Globe className="h-3.5 w-3.5 mr-1.5" />
                        Explore Worldwide
                      </Button>
                    )}

                    {isAuthenticated && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/seeker/profile')}
                      >
                        <MapPin className="h-3.5 w-3.5 mr-1.5" />
                        Change Country
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                /* Job Cards Grid */
                <>
                  <div className="grid grid-cols-1 gap-4">
                    {data?.data.map((job) => (
                      <JobCard key={job._id} job={job} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {data && data.pagination.pages > 1 && (
                    <div className="mt-10 flex justify-center">
                      <Pagination
                        currentPage={page}
                        totalPages={data.pagination.pages}
                        onPageChange={(newPage) => {
                          updateUrlParams(filters, newPage);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};
