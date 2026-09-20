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
  const [activeTab, setActiveTab] = useState<'all' | 'remote'>('all');
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
      <div className="space-y-6 animate-fadeIn">
        {/* Header Banner */}
        <div className="clay-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FFF7ED] text-[#EA580C] mb-2">
              <Bookmark className="h-3.5 w-3.5 fill-current" />
              Career Vault
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#25243A] tracking-tight">Saved Opportunities</h1>
            <p className="text-sm font-medium text-[#7E7C9A] mt-0.5">
              Keep track of high-potential positions and apply when ready ({data?.pagination?.total || 0} saved)
            </p>
          </div>

          {/* Quick Tab Switcher */}
          {savedList.length > 0 && (
            <div className="flex items-center bg-slate-900/90 border border-white/10 p-1.5 rounded-2xl self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 scale-[1.02]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({savedList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('remote')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'remote'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 scale-[1.02]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
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
          <div className="genz-card p-12 text-center max-w-xl mx-auto">
            <div className="h-16 w-16 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
              <Bookmark className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">No saved jobs yet</h3>
            <p className="text-sm font-medium text-slate-400 mb-6">
              Browse positions and bookmark them to keep track of deadlines and requirements.
            </p>
            <Link to="/jobs">
              <Button size="lg" variant="primary">
                <Compass className="h-4 w-4 mr-2" />
                <span>Explore Opportunities</span>
              </Button>
            </Link>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="clay-card p-8 text-center">
            <p className="text-sm font-bold text-[#25243A]">No saved jobs match this tab filter.</p>
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className="mt-3 text-xs font-black text-[#6C5CE7] hover:underline cursor-pointer"
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
            {data && data.pagination && data.pagination.pages > 1 && (
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
