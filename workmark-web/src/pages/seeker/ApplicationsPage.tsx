import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useMyApplications } from '../../hooks/useApplications';
import { ApplicationCard } from '../../components/applications/ApplicationCard';
import { Select } from '../../components/ui/Select';
import { Pagination } from '../../components/ui/Pagination';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { FileText, Sparkles } from 'lucide-react';
import type { ApplicationStatus } from '../../types';

export const ApplicationsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const highlightedAppId = searchParams.get('applicationId');

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ApplicationStatus | undefined>();

  const { data, isLoading } = useMyApplications({ page, limit: 10, status });

  useEffect(() => {
    if (highlightedAppId) {
      setTimeout(() => {
        const el = document.getElementById(`application-${highlightedAppId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [highlightedAppId, data]);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fadeIn">
        {/* Header Banner */}
        <div className="clay-card p-6 sm:p-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Candidate Tracker
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              My Job Applications
            </h1>
            <p className="text-sm font-medium text-slate-400 mt-0.5">
              Live updates on interviews, shortlists, and employer reviews.
            </p>
          </div>

          <Select
            options={[
              { value: '', label: 'All Applications' },
              { value: 'pending', label: 'Applied' },
              { value: 'reviewed', label: 'Under Review' },
              { value: 'shortlisted', label: 'Shortlisted' },
              { value: 'interview', label: 'Interview Stage' },
              { value: 'accepted', label: 'Accepted / Offer' },
              { value: 'rejected', label: 'Not Selected' },
            ]}
            value={status || ''}
            onChange={(e) => {
              setStatus((e.target.value || undefined) as ApplicationStatus | undefined);
              setPage(1);
            }}
            className="w-full sm:w-56"
          />
        </div>

        {/* Applications List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : data?.data.length === 0 ? (
          <div className="clay-card py-12">
            <EmptyState
              icon={<FileText className="h-12 w-12 text-[#6C5CE7]" />}
              title="No applications found"
              description="Start applying to matching jobs to track your recruitment stages here."
              action={{
                label: 'Explore Opportunities',
                onClick: () => (window.location.href = '/jobs'),
              }}
            />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {data?.data.map((application) => (
                <ApplicationCard
                  key={application._id}
                  application={application}
                  isHighlighted={application._id === highlightedAppId}
                />
              ))}
            </div>

            {/* Pagination */}
            {data && data.pagination?.pages && data.pagination.pages > 1 && (
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
