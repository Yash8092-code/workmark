import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { useMyApplications } from '../../hooks/useApplications';
import { useSavedJobs } from '../../hooks/useSavedJobs';
import { StatCard } from '../../components/dashboard/StatCard';
import { RecentApplications } from '../../components/dashboard/RecentApplications';
import { ProfileCompletion } from '../../components/profile/ProfileCompletion';
import { OpportunityRadar } from '../../components/jobs/OpportunityRadar';
import { useProfile } from '../../hooks/useProfile';
import { FileText, Bookmark, Compass, Sparkles, ArrowRight } from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { getCountryDisplayName, getCountryFlag } from '../../utils/countries';

export const SeekerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: applications } = useMyApplications({ limit: 5 });
  const { data: savedJobs } = useSavedJobs({ limit: 5 });

  const countryName = getCountryDisplayName(user?.countryCode);
  const countryFlag = getCountryFlag(user?.countryCode);

  if (profileLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Career Command
              </span>
              {user?.countryCode && (
                <span className="text-xs font-semibold text-[#64748B] flex items-center gap-1">
                  <span>{countryFlag}</span>
                  <span>{countryName}</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Welcome back, {user?.name.split(' ')[0]}!
            </h1>
            <p className="text-sm text-[#64748B] mt-1">
              Your personalized career discovery overview and active pipeline.
            </p>
          </div>

          <Link to="/jobs">
            <Button size="lg" className="rounded-xl font-bold shadow-md shadow-blue-600/20">
              <Compass className="h-4 w-4 mr-2" />
              <span>Explore Roles</span>
            </Button>
          </Link>
        </div>

        {/* Opportunity Radar Banner */}
        <OpportunityRadar
          currentFilters={{ country: user?.countryCode }}
          onApplyPreset={(preset) => {
            const params = new URLSearchParams();
            if (preset.country) params.set('country', preset.country);
            if (preset.workMode) params.set('workMode', preset.workMode.join(','));
            if (preset.category) params.set('category', preset.category);
            navigate(`/jobs?${params.toString()}`);
          }}
        />

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            icon={<FileText className="h-6 w-6" />}
            label="Active Applications"
            value={applications?.pagination.total || 0}
            iconBgColor="bg-[#2563EB]"
          />
          <StatCard
            icon={<Bookmark className="h-6 w-6" />}
            label="Bookmarked Jobs"
            value={savedJobs?.pagination.total || 0}
            iconBgColor="bg-[#D97706]"
          />
          <StatCard
            icon={<Sparkles className="h-6 w-6" />}
            label="Target Market"
            value={countryName || 'Global'}
            iconBgColor="bg-[#10B981]"
          />
        </div>

        {/* Main Grid: Applications Tracker & Profile Strength */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#F1F5F9]">
                <div>
                  <h2 className="text-lg font-bold text-[#0F172A]">Recent Applications</h2>
                  <p className="text-xs text-[#64748B]">Review your active recruitment stages</p>
                </div>
                <Link
                  to="/seeker/applications"
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <RecentApplications />
            </div>
          </div>

          {/* Profile Strength */}
          <div>
            {profile && <ProfileCompletion profile={profile} />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
