import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useSavedJobs } from '../../hooks/useSavedJobs';
import { JobCard } from '../../components/jobs/JobCard';
import { Pagination } from '../../components/ui/Pagination';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { Bookmark, Globe, Compass } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const SavedJobsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'all' | 'remote' | 'country'>('all');
  const { data, isLoading } = useSavedJobs({ page, limit: 12 });

  const savedList = data?.data || [];

  // Filter items in active tab
  const filteredJobs = useMemo(() => {
    return savedList.filter((savedJob) => {
      const job = typeof savedJob.jobId === 'object' ? savedJob.jobId : null;
      if (!job) return false;
      if (activeTab === 'remote') return job.workMode === 'remote';
      return true;
    });
  }, [savedList, activeTab]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-[#E2E8F0] shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                <Bookmark className="h-4 w-4 fill-current" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Career Vault</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">Saved Opportunities</h1>
            <p className="text-sm text-[#64748B] mt-1">
              Keep track of high-potential positions and apply when ready ({data?.pagination?.total || 0} saved)
            </p>
          </div>

          {/* Quick Tab Switcher */}
          {savedList.length > 0 && (
            <div className="flex items-center bg-[#F1F5F9] p-1 rounded-2xl border border-[#E2E8F0] self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white text-[#0F172A] shadow-xs border border-[#E2E8F0]'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                All ({savedList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('remote')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'remote'
                    ? 'bg-white text-[#0F172A] shadow-xs border border-[#E2E8F0]'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <Globe className="h-3.5 w-3.5 text-emerald-600" />
                <span>Remote</span>
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : savedList.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-12 text-center max-w-xl mx-auto shadow-xs">
            <div className="h-16 w-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <Bookmark className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-2">You haven't saved any opportunities yet</h2>
            <p className="text-sm text-[#64748B] mb-6 max-w-sm mx-auto leading-relaxed">
              Explore open roles matched to your location and profile, and bookmark the ones you'd like to revisit.
            </p>
            <Link to="/jobs">
              <Button size="lg" className="rounded-xl font-bold shadow-md shadow-blue-600/20">
                <Compass className="h-4 w-4 mr-2" />
                <span>Explore Opportunities</span>
              </Button>
            </Link>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-8 text-center shadow-xs">
            <p className="text-sm font-semibold text-[#0F172A]">No saved jobs match this tab.</p>
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className="mt-3 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Show all saved jobs
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4">
              {filteredJobs.map((savedJob) => {
                const job = typeof savedJob.jobId === 'object' ? savedJob.jobId : null;
                return job ? <JobCard key={savedJob._id} job={job} isSaved={true} /> : null;
              })}
            </div>

            {/* Pagination */}
            {data && data.pagination.pages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  totalPages={data.pagination.pages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};
