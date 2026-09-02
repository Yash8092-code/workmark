import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useMyApplications } from '../../hooks/useApplications';
import { ApplicationCard } from '../../components/applications/ApplicationCard';
import { Select } from '../../components/ui/Select';
import { Pagination } from '../../components/ui/Pagination';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { FileText } from 'lucide-react';
import type { ApplicationStatus } from '../../types';

export const ApplicationsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ApplicationStatus | undefined>();

  const { data, isLoading } = useMyApplications({ page, limit: 10, status });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#172033] mb-2">My Applications</h1>
            <p className="text-[#64748B]">Track and manage your job applications</p>
          </div>

          <Select
            options={[
              { value: '', label: 'All Applications' },
              { value: 'applied', label: 'Applied' },
              { value: 'under_review', label: 'Under Review' },
              { value: 'shortlisted', label: 'Shortlisted' },
              { value: 'interview', label: 'Interview' },
              { value: 'selected', label: 'Selected' },
              { value: 'rejected', label: 'Rejected' },
            ]}
            value={status || ''}
            onChange={(e) => {
              setStatus(e.target.value as ApplicationStatus | undefined);
              setPage(1);
            }}
            className="w-full sm:w-48"
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
          <EmptyState
            icon={<FileText className="h-12 w-12" />}
            title="No applications yet"
            description="Start applying to jobs to see your applications here"
            action={{
              label: 'Browse Jobs',
              onClick: () => (window.location.href = '/jobs'),
            }}
          />
        ) : (
          <>
            <div className="space-y-4">
              {data?.data.map((application) => (
                <ApplicationCard key={application._id} application={application} />
              ))}
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
