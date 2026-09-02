import React from 'react';
import { useJobs } from '../../hooks/useJobs';
import { JobCard } from './JobCard';
import { SkeletonCard } from '../ui/Skeleton';

interface SimilarJobsProps {
  currentJobId: string;
  category?: string;
  skills?: string[];
}

export const SimilarJobs: React.FC<SimilarJobsProps> = ({ currentJobId, category }) => {
  const { data, isLoading } = useJobs({ category, limit: 4 });

  const similarJobs = data?.data.filter((job) => job._id !== currentJobId).slice(0, 3);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-[#172033]">Similar Jobs</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!similarJobs || similarJobs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-[#172033]">Similar Jobs</h3>
      <div className="space-y-4">
        {similarJobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    </div>
  );
};
