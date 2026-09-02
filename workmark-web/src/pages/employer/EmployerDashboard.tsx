import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useEmployerJobs } from '../../hooks/useJobs';
import { StatCard } from '../../components/dashboard/StatCard';
import { Briefcase, Users, Eye, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { SkeletonCard } from '../../components/ui/Skeleton';

export const EmployerDashboard: React.FC = () => {
  const { data: jobs, isLoading } = useEmployerJobs({ limit: 5 });

  const totalApplications = jobs?.data.reduce((sum, job) => sum + job.applicationCount, 0) || 0;
  const totalViews = jobs?.data.reduce((sum, job) => sum + job.viewCount, 0) || 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#172033] mb-2">Employer Dashboard</h1>
            <p className="text-[#64748B]">Manage your job postings and applications</p>
          </div>
          <Link to="/employer/jobs/create">
            <Button>Post a Job</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Briefcase className="h-6 w-6" />}
            label="Active Jobs"
            value={jobs?.data.filter(j => j.status === 'active').length || 0}
            iconBgColor="bg-[#2563EB]"
          />
          <StatCard
            icon={<Users className="h-6 w-6" />}
            label="Total Applications"
            value={totalApplications}
            iconBgColor="bg-[#16A34A]"
          />
          <StatCard
            icon={<Eye className="h-6 w-6" />}
            label="Profile Views"
            value={totalViews}
            iconBgColor="bg-[#D97706]"
          />
          <StatCard
            icon={<TrendingUp className="h-6 w-6" />}
            label="This Month"
            value={0}
            iconBgColor="bg-[#7C3AED]"
          />
        </div>

        {/* Recent Jobs */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#172033]">Recent Job Postings</h2>
            <Link to="/employer/jobs" className="text-[#2563EB] hover:text-[#1d4ed8] text-sm font-medium">
              View All
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {jobs?.data.slice(0, 5).map((job) => (
                <div key={job._id} className="flex items-center justify-between p-4 border border-[#E2E8F0] rounded-lg">
                  <div>
                    <Link to={`/jobs/${job._id}`} className="font-semibold text-[#172033] hover:text-[#2563EB]">
                      {job.title}
                    </Link>
                    <div className="flex items-center space-x-4 text-sm text-[#64748B] mt-1">
                      <span>{job.applicationCount} applications</span>
                      <span>{job.viewCount} views</span>
                      <span className="capitalize">{job.status}</span>
                    </div>
                  </div>
                  <Link to={`/employer/jobs/${job._id}/applicants`}>
                    <Button variant="outline" size="sm">
                      View Applicants
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
