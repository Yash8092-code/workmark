import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { useSeekerDashboard } from '../../hooks/useDashboard';
import { JobCard } from '../../components/jobs/JobCard';
import {
  FileText,
  Bookmark,
  Sparkles,
  TrendingUp,
  Compass,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Search,
  Upload,
  User,
  Zap,
  RefreshCw,
} from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { getCountryDisplayName, getCountryFlag } from '../../utils/countries';
import { formatDistanceToNow } from 'date-fns';

export const SeekerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: dashboardData, isLoading, isError, refetch } = useSeekerDashboard();

  const [activeTab, setActiveTab] = useState<'strong' | 'stretch' | 'remote' | 'recent'>('strong');

  const countryName = getCountryDisplayName(user?.countryCode);
  const countryFlag = getCountryFlag(user?.countryCode);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Spinner size="lg" />
          <p className="text-sm font-bold text-[#7E7C9A]">Loading your Career Command Center...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !dashboardData) {
    return (
      <DashboardLayout>
        <div className="clay-card p-8 text-center max-w-lg mx-auto my-12">
          <div className="h-14 w-14 rounded-2xl bg-[#FF6B81]/15 text-[#FF6B81] flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-black text-[#25243A] mb-2">Unable to load dashboard data</h2>
          <p className="text-sm font-medium text-[#7E7C9A] mb-6">There was a temporary issue loading your career metrics.</p>
          <Button onClick={() => refetch()} variant="primary">
            <RefreshCw className="h-4 w-4 mr-2" />
            <span>Retry Connection</span>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const {
    profileReadiness,
    metrics,
    pipeline,
    recommendations,
    skillInsights,
    recentActivity,
  } = dashboardData;

  const currentTabJobs =
    activeTab === 'strong'
      ? recommendations.strongMatches
      : activeTab === 'stretch'
      ? recommendations.skillStretch
      : activeTab === 'remote'
      ? recommendations.remoteAndGlobal
      : recommendations.recentlyAdded;

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fadeIn">
        {/* Top Hero Command Banner */}
        <div className="clay-card-dark p-6 sm:p-8 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#8ED8FF] bg-[#8ED8FF]/20 px-3 py-1 rounded-full border border-[#8ED8FF]/30">
                  Career Command Center
                </span>
                {user?.countryCode && (
                  <span className="text-xs font-bold text-white/90 flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
                    <span>{countryFlag}</span>
                    <span>{countryName}</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Welcome back, {user?.name.split(' ')[0]}!
              </h1>
              <p className="text-sm font-medium text-white/80 mt-1 max-w-xl leading-relaxed">
                Opportunity radar has identified{' '}
                <strong className="text-[#8ED8FF] font-bold">{metrics.strongMatchesCount} strong matches</strong> and{' '}
                <strong className="text-[#EDE9FE] font-bold">{recommendations.skillStretch.length} skill stretch roles</strong> tailored to your profile.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/jobs">
                <Button size="lg" variant="primary" className="shadow-lg shadow-[#6C5CE7]/30">
                  <Compass className="h-4 w-4 mr-2" />
                  <span>Discover Opportunities</span>
                </Button>
              </Link>
              <Link to="/seeker/profile/edit">
                <Button variant="ghost" size="lg" className="bg-white/15 text-white hover:bg-white/25 border border-white/20">
                  <User className="h-4 w-4 mr-2" />
                  <span>Edit Profile</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Low Profile Data Fallback Banner */}
        {profileReadiness.percentage < 40 && (
          <div className="clay-card p-5 border-l-4 border-l-[#FFB84D] bg-[#FFFBEB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-[#FFB84D]/20 text-[#B45309] shrink-0 mt-0.5">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#92400E]">Complete your profile for precise matching</h3>
                <p className="text-xs text-[#B45309] mt-0.5">
                  Adding your core skills, work history, and job preferences unlocks deterministic Opportunity Intelligence scoring.
                </p>
              </div>
            </div>
            <Link to="/seeker/profile/edit">
              <Button size="sm" variant="primary" className="shrink-0">
                Complete Profile
              </Button>
            </Link>
          </div>
        )}

        {/* Key KPI Metric Cards (Clickable) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Link
            to="/seeker/applications"
            className="clay-card p-5 sm:p-6 group hover:scale-[1.02] transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#7E7C9A]">Active Applications</span>
              <div className="p-2.5 rounded-2xl bg-[#EDE9FE] text-[#6C5CE7] group-hover:bg-[#6C5CE7] group-hover:text-white transition-colors">
                <FileText className="h-5 w-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#25243A] tracking-tight">
              {metrics.activeApplications}
            </div>
            <p className="text-xs font-bold text-[#6C5CE7] mt-1.5 flex items-center gap-1">
              <span>View pipeline</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </p>
          </Link>

          <Link
            to="/seeker/saved-jobs"
            className="clay-card p-5 sm:p-6 group hover:scale-[1.02] transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#7E7C9A]">Saved Bookmarks</span>
              <div className="p-2.5 rounded-2xl bg-[#FFF7ED] text-[#EA580C] group-hover:bg-[#EA580C] group-hover:text-white transition-colors">
                <Bookmark className="h-5 w-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#25243A] tracking-tight">
              {metrics.savedJobs}
            </div>
            <p className="text-xs font-bold text-[#EA580C] mt-1.5 flex items-center gap-1">
              <span>View saved</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </p>
          </Link>

          <Link
            to="/jobs?sort=recommended"
            className="clay-card p-5 sm:p-6 group hover:scale-[1.02] transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#7E7C9A]">Strong Matches</span>
              <div className="p-2.5 rounded-2xl bg-[#ECFDF5] text-[#059669] group-hover:bg-[#059669] group-hover:text-white transition-colors">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#25243A] tracking-tight">
              {metrics.strongMatchesCount}
            </div>
            <p className="text-xs font-bold text-[#059669] mt-1.5 flex items-center gap-1">
              <span>Score &ge; 75% match</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </p>
          </Link>

          <Link
            to="/seeker/applications?status=shortlisted"
            className="clay-card p-5 sm:p-6 group hover:scale-[1.02] transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#7E7C9A]">Shortlisted / Reviews</span>
              <div className="p-2.5 rounded-2xl bg-[#EFF6FF] text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#25243A] tracking-tight">
              {metrics.shortlistedCount}
            </div>
            <p className="text-xs font-bold text-[#2563EB] mt-1.5 flex items-center gap-1">
              <span>In active review</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </p>
          </Link>
        </div>

        {/* Main Grid: Application Pipeline & Profile Readiness */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Application Pipeline Stage Visualizer */}
          <div className="lg:col-span-2 clay-card p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E6E8F2]">
                <div>
                  <h2 className="text-lg font-black text-[#25243A]">Application Pipeline</h2>
                  <p className="text-xs font-semibold text-[#7E7C9A]">Live recruitment stage tracker for submitted roles</p>
                </div>
                <Link
                  to="/seeker/applications"
                  className="text-xs font-bold text-[#6C5CE7] hover:underline flex items-center gap-1"
                >
                  <span>All Applications</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Pipeline Stages */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div
                  onClick={() => navigate('/seeker/applications?status=pending')}
                  className="p-4 rounded-2xl bg-[#F7F7FB] border border-[#E6E8F2] hover:border-[#6C5CE7] hover:bg-[#EDE9FE]/30 transition-all cursor-pointer text-center"
                >
                  <span className="text-[11px] font-black text-[#7E7C9A] uppercase tracking-wider block mb-1">
                    Applied
                  </span>
                  <span className="text-xl font-black text-[#25243A]">{pipeline.pending}</span>
                  <span className="text-[10px] font-bold text-[#7E7C9A] block mt-0.5">Pending</span>
                </div>

                <div
                  onClick={() => navigate('/seeker/applications?status=reviewed')}
                  className="p-4 rounded-2xl bg-[#EFF6FF]/60 border border-[#DBEAFE] hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-all cursor-pointer text-center"
                >
                  <span className="text-[11px] font-black text-[#2563EB] uppercase tracking-wider block mb-1">
                    Reviewed
                  </span>
                  <span className="text-xl font-black text-[#1E40AF]">{pipeline.reviewed}</span>
                  <span className="text-[10px] font-bold text-[#3B82F6] block mt-0.5">Screening</span>
                </div>

                <div
                  onClick={() => navigate('/seeker/applications?status=shortlisted')}
                  className="p-4 rounded-2xl bg-[#EDE9FE]/60 border border-[#DDD6FE] hover:border-[#6C5CE7] hover:bg-[#EDE9FE] transition-all cursor-pointer text-center"
                >
                  <span className="text-[11px] font-black text-[#6C5CE7] uppercase tracking-wider block mb-1">
                    Shortlisted
                  </span>
                  <span className="text-xl font-black text-[#5146C7]">{pipeline.shortlisted}</span>
                  <span className="text-[10px] font-bold text-[#6C5CE7] block mt-0.5">Interview</span>
                </div>

                <div
                  onClick={() => navigate('/seeker/applications?status=accepted')}
                  className="p-4 rounded-2xl bg-[#ECFDF5]/60 border border-[#A7F3D0] hover:border-[#059669] hover:bg-[#ECFDF5] transition-all cursor-pointer text-center"
                >
                  <span className="text-[11px] font-black text-[#059669] uppercase tracking-wider block mb-1">
                    Selected
                  </span>
                  <span className="text-xl font-black text-[#065F46]">{pipeline.accepted}</span>
                  <span className="text-[10px] font-bold text-[#059669] block mt-0.5">Offers</span>
                </div>

                <div
                  onClick={() => navigate('/seeker/applications?status=rejected')}
                  className="p-4 rounded-2xl bg-[#F7F7FB] border border-[#E6E8F2] hover:border-[#FF6B81] transition-all cursor-pointer text-center col-span-2 sm:col-span-1"
                >
                  <span className="text-[11px] font-black text-[#7E7C9A] uppercase tracking-wider block mb-1">
                    Archived
                  </span>
                  <span className="text-xl font-black text-[#25243A]">{pipeline.rejected}</span>
                  <span className="text-[10px] font-bold text-[#7E7C9A] block mt-0.5">Closed</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-[#E6E8F2] flex items-center justify-between text-xs font-semibold text-[#7E7C9A]">
              <span>Updated from verified recruitment records</span>
              <Link to="/seeker/applications" className="font-bold text-[#6C5CE7] hover:underline">
                Manage all {metrics.activeApplications} active &rarr;
              </Link>
            </div>
          </div>

          {/* Profile Readiness 10-Point Card */}
          <div className="clay-card p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-black text-[#25243A]">Profile Readiness</h2>
                  <p className="text-xs font-semibold text-[#7E7C9A]">Across 10 core verification signals</p>
                </div>
                <span className="text-2xl font-black text-[#6C5CE7] bg-[#EDE9FE] px-3.5 py-1 rounded-2xl shadow-inner">
                  {profileReadiness.percentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#E6E8F2] rounded-full h-3 mb-5 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-[#6C5CE7] to-[#8ED8FF] h-3 rounded-full transition-all duration-500"
                  style={{ width: `${profileReadiness.percentage}%` }}
                />
              </div>

              {/* Actionable Missing Items Checklist */}
              {profileReadiness.missingItems.length > 0 ? (
                <div className="space-y-2 mb-4">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#7E7C9A] block">
                    Recommended steps ({profileReadiness.missingItems.length}):
                  </span>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {profileReadiness.missingItems.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-bold text-[#25243A] bg-[#F7F7FB] p-2.5 rounded-xl border border-[#E6E8F2]">
                        <span className="h-2 w-2 rounded-full bg-[#FFB84D] shrink-0" />
                        <span>Add {item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-[#ECFDF5] rounded-2xl border border-[#A7F3D0] text-xs text-[#065F46] font-bold flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0" />
                  <span>All core signals verified! Profile fully optimized.</span>
                </div>
              )}
            </div>

            <Link to="/seeker/profile/edit" className="block pt-2">
              <Button variant="secondary" className="w-full justify-center">
                <UserCheck className="h-4 w-4 mr-1.5" />
                <span>Complete Profile ({100 - profileReadiness.percentage}% left)</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Personalized Opportunities Feed (Deduplicated Top-6 Tabs) */}
        <div className="clay-card p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E6E8F2]">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-[#EDE9FE] text-[#6C5CE7]">
                  <Zap className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-black text-[#25243A] tracking-tight">
                  Recommended Opportunities
                </h2>
              </div>
              <p className="text-xs font-semibold text-[#7E7C9A] mt-0.5">
                Deterministic matching based on verified skills, career level, and location preferences
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/90 border border-white/10 rounded-2xl overflow-x-auto max-w-full">
              <button
                type="button"
                onClick={() => setActiveTab('strong')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'strong'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 scale-[1.02]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🔥 Strong Matches ({recommendations.strongMatches.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('stretch')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'stretch'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🧩 Skill Stretch ({recommendations.skillStretch.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('remote')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'remote'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 scale-[1.02]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🌐 Remote ({recommendations.remoteAndGlobal.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('recent')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'recent'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25 scale-[1.02]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ⚡ Fresh ({recommendations.recentlyAdded.length})
              </button>
            </div>
          </div>

          {/* Jobs List Grid */}
          {currentTabJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentTabJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center max-w-md mx-auto">
              <div className="h-14 w-14 rounded-2xl bg-[#EDE9FE] text-[#6C5CE7] flex items-center justify-center mx-auto mb-3">
                <Compass className="h-7 w-7" />
              </div>
              <h3 className="text-base font-black text-[#25243A] mb-1">
                No opportunities in this category yet
              </h3>
              <p className="text-xs font-medium text-[#7E7C9A] mb-4">
                Explore worldwide jobs or adjust your career preferences to unlock more personalized matches.
              </p>
              <Link to="/jobs">
                <Button variant="secondary" size="sm">
                  Browse All Opportunities
                </Button>
              </Link>
            </div>
          )}

          {/* Section Footer */}
          <div className="mt-8 pt-4 border-t border-[#E6E8F2] flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7E7C9A]">Showing top deduplicated matches</span>
            <Link to="/jobs" className="text-xs font-bold text-[#6C5CE7] hover:underline flex items-center gap-1">
              <span>Explore all live roles</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Bottom Split: Market Skill Insights & Recent Persisted Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Market Skill Insights */}
          <div className="clay-card p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-xl bg-[#EDE9FE] text-[#6C5CE7]">
                <Layers className="h-4 w-4" />
              </span>
              <h2 className="text-base font-black text-[#25243A]">Market Skill Signals</h2>
            </div>
            <p className="text-xs font-medium text-[#7E7C9A] mb-4 leading-relaxed">
              {skillInsights.marketContext}
            </p>

            {skillInsights.inDemandSkills.length > 0 ? (
              <div className="space-y-2.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#7E7C9A] block">
                  In-demand in open vacancies:
                </span>
                <div className="space-y-2">
                  {skillInsights.inDemandSkills.map((item, idx) => {
                    const isUserPossessed = skillInsights.userSkills.some(
                      (u) => u.toLowerCase() === item.skill.toLowerCase()
                    );
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl border border-[#E6E8F2] bg-[#F7F7FB] text-xs font-bold"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${isUserPossessed ? 'bg-[#35C98A]' : 'bg-[#6C5CE7]'}`} />
                          <span className="text-[#25243A]">{item.skill}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-[#7E7C9A]">
                            {item.jobCount} job{item.jobCount > 1 ? 's' : ''}
                          </span>
                          {isUserPossessed ? (
                            <span className="text-[10px] font-black text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-lg border border-[#A7F3D0]">
                              In Profile
                            </span>
                          ) : (
                            <span className="text-[10px] font-black text-[#6C5CE7] bg-[#EDE9FE] px-2 py-0.5 rounded-lg border border-[#DDD6FE]">
                              Growth
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#7E7C9A] italic">Market skill trends will appear as more jobs are indexed.</p>
            )}
          </div>

          {/* Recent Persisted Activity Timeline */}
          <div className="lg:col-span-2 clay-card p-6 sm:p-8">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E6E8F2]">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-[#EDE9FE] text-[#6C5CE7]">
                  <Clock className="h-4 w-4" />
                </span>
                <h2 className="text-base font-black text-[#25243A]">Recent Career Activity</h2>
              </div>
              <span className="text-[11px] font-bold text-[#7E7C9A]">Persisted Activity Stream</span>
            </div>

            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-cyan-500/30 transition-all"
                  >
                    <div className="p-2 rounded-xl bg-slate-800 border border-white/10 shrink-0 mt-0.5">
                      {activity.type === 'application_submitted' ? (
                        <FileText className="h-4 w-4 text-cyan-400" />
                      ) : activity.type === 'job_saved' ? (
                        <Bookmark className="h-4 w-4 text-amber-400" />
                      ) : (
                        <Sparkles className="h-4 w-4 text-emerald-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-black text-white truncate">{activity.title}</h4>
                        <span className="text-[10px] font-bold text-slate-400 shrink-0">
                          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-400 mt-0.5">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-xs font-bold text-[#7E7C9A]">No recent activity recorded yet. Start by saving or applying to jobs!</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Action Dock */}
        <div className="clay-card-soft p-5 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs font-black uppercase tracking-wider text-[#7E7C9A]">Quick Navigation:</span>
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/jobs">
              <Button variant="secondary" size="sm" className="text-xs">
                <Search className="h-3.5 w-3.5 mr-1" />
                <span>Search Jobs</span>
              </Button>
            </Link>
            <Link to="/seeker/profile/edit">
              <Button variant="secondary" size="sm" className="text-xs">
                <Upload className="h-3.5 w-3.5 mr-1" />
                <span>Upload Resume / Avatar</span>
              </Button>
            </Link>
            <Link to="/seeker/saved-jobs">
              <Button variant="secondary" size="sm" className="text-xs">
                <Bookmark className="h-3.5 w-3.5 mr-1" />
                <span>Saved Jobs ({metrics.savedJobs})</span>
              </Button>
            </Link>
            <Link to="/seeker/applications">
              <Button variant="secondary" size="sm" className="text-xs">
                <FileText className="h-3.5 w-3.5 mr-1" />
                <span>Applications ({metrics.activeApplications})</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
