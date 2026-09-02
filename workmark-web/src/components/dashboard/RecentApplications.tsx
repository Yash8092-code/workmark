import React from 'react';
import { useMyApplications } from '../../hooks/useApplications';
import { ApplicationCard } from '../applications/ApplicationCard';
import { SkeletonCard } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RecentApplications: React.FC = () => {
  const { data, isLoading } = useMyApplications({ limit: 5 });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="h-12 w-12" />}
        title="No applications yet"
        description="Start applying to jobs to see your applications here"
        action={{
          label: 'Browse Jobs',
          onClick: () => (window.location.href = '/jobs'),
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#172033]">Recent Applications</h3>
        <Link to="/seeker/applications" className="text-[#2563EB] hover:text-[#1d4ed8] text-sm font-medium">
          View All
        </Link>
      </div>
      {data.data.map((application) => (
        <ApplicationCard key={application._id} application={application} />
      ))}
    </div>
  );
};
