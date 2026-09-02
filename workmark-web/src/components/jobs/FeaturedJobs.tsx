import React from 'react';
import { Link } from 'react-router-dom';
import { useFeaturedJobs } from '../../hooks/useJobs';
import { JobCard } from './JobCard';
import { SkeletonCard } from '../ui/Skeleton';
import { ArrowRight, Sparkles } from 'lucide-react';

export const FeaturedJobs: React.FC = () => {
  const { data: jobs, isLoading } = useFeaturedJobs();

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-200/80">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Hand-Picked Roles</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Featured Opportunities
            </h2>
            <p className="text-sm text-[#64748B] mt-1">
              Top roles actively hiring from leading tech employers
            </p>
          </div>
          <Link
            to="/jobs"
            className="text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 group"
          >
            <span>Explore all open positions</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs?.slice(0, 6).map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
