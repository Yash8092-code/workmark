import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { useEmployerDashboard } from '../../hooks/useDashboard';
import { useUpdateApplicationStatus } from '../../hooks/useApplications';
import {
  Briefcase,
  Users,
  UserCheck,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  Building2,
  Sparkles,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { Avatar } from '../../components/ui/Avatar';
import { formatDistanceToNow } from 'date-fns';

export const EmployerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: dashboardData, isLoading, isError, refetch } = useEmployerDashboard();
  const updateStatusMutation = useUpdateApplicationStatus();

  // Rejection confirmation dialog state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [selectedCandidateName, setSelectedCandidateName] = useState<string>('');

  const handleStatusChange = (appId: string, status: any) => {
    updateStatusMutation.mutate({ id: appId, status });
  };

  const openRejectConfirmation = (appId: string, candidateName: string) => {
    setSelectedAppId(appId);
    setSelectedCandidateName(candidateName);
    setRejectModalOpen(true);
  };

  const confirmReject = () => {
    if (selectedAppId) {
      updateStatusMutation.mutate({ id: selectedAppId, status: 'rejected' as any });
      setRejectModalOpen(false);
      setSelectedAppId(null);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Spinner size="lg" />
          <p className="text-xs sm:text-sm font-bold text-slate-400">
            Loading Recruitment Command Center...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !dashboardData) {
    return (
      <DashboardLayout>
        <Card variant="raised" className="p-8 text-center max-w-lg mx-auto my-12">
          <div className="h-14 w-14 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/25 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-black text-white mb-2 tracking-tight">
            Unable to load recruiter dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mb-6">
            Failed to retrieve company metrics and applicants pipeline.
          </p>
          <Button onClick={() => refetch()} variant="primary" size="md">
            <RefreshCw className="h-4 w-4 mr-2" />
            <span>Retry</span>
          </Button>
        </Card>
      </DashboardLayout>
    );
  }

  const {
    companyReadiness,
    metrics,
    pipeline,
    candidatesNeedingAttention,
    jobPerformance,
    recruitmentInsights,
  } = dashboardData;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Top Recruiter Command Header */}
        <div className="clay-card-dark p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#35C98A] bg-[#35C98A]/20 px-3 py-1 rounded-xl border border-[#35C98A]/30">
                  Recruitment Command Center
                </span>
                <span className="text-xs font-bold text-white/80 bg-white/10 px-3 py-1 rounded-xl border border-white/15">
                  {user?.name || 'Recruiter Workspace'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Recruiter Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                You have{' '}
                <strong className="text-[#FFB84D] font-black">
                  {metrics.candidatesToReview} candidate{metrics.candidatesToReview === 1 ? '' : 's'} awaiting review
                </strong>{' '}
                across <strong className="text-white font-black">{metrics.activeJobs} active job posting{metrics.activeJobs === 1 ? '' : 's'}</strong>.
              </p>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/employer/jobs/create">
                <Button variant="primary" size="lg" className="shadow-lg">
                  <Plus className="h-4 w-4 mr-1.5" />
                  <span>Post a New Job</span>
                </Button>
              </Link>
              <Link to="/employer/jobs">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/15 text-white border-white/25 hover:bg-white/25 hover:text-white"
                >
                  <Briefcase className="h-4 w-4 mr-1.5" />
                  <span>Manage Listings</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 6 Key Overview Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          <Card variant="raised" className="p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#6F6D82]">Active Jobs</span>
              <div className="p-2 rounded-xl bg-[#E8F4FF] text-[#2563EB]">
                <Briefcase className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#25243A]">{metrics.activeJobs}</div>
              <span className="text-[10px] font-bold text-[#6F6D82]">Published roles</span>
            </div>
          </Card>

          <Card variant="raised" className="p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#6F6D82]">Total Applicants</span>
              <div className="p-2 rounded-xl bg-[#EDE9FE] text-[#6C5CE7]">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#25243A]">{metrics.totalApplications}</div>
              <span className="text-[10px] font-bold text-[#6F6D82]">Lifetime received</span>
            </div>
          </Card>

          <Card variant="raised" className="p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#6F6D82]">To Review</span>
              <div className="p-2 rounded-xl bg-[#FFF7EB] text-[#D97706]">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#D97706]">{metrics.candidatesToReview}</div>
              <span className="text-[10px] font-bold text-[#6F6D82]">Pending screening</span>
            </div>
          </Card>

          <Card variant="raised" className="p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#6F6D82]">Shortlisted</span>
              <div className="p-2 rounded-xl bg-[#EDE9FE] text-[#6C5CE7]">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#6C5CE7]">{metrics.shortlistedCandidates}</div>
              <span className="text-[10px] font-bold text-[#6F6D82]">In screening</span>
            </div>
          </Card>

          <Card variant="raised" className="p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#6F6D82]">Interviews</span>
              <div className="p-2 rounded-xl bg-[#E8F4FF] text-[#0284C7]">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#0284C7]">{metrics.interviewCandidates ?? 0}</div>
              <span className="text-[10px] font-bold text-[#6F6D82]">Scheduled</span>
            </div>
          </Card>

          <Card variant="raised" className="p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#6F6D82]">Hires / Offers</span>
              <div className="p-2 rounded-xl bg-[#E6F9F0] text-[#059669]">
                <UserCheck className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#059669]">{metrics.hiresCount}</div>
              <span className="text-[10px] font-bold text-[#6F6D82]">Accepted talent</span>
            </div>
          </Card>
        </div>

        {/* Recruitment Pipeline Funnel & Company Readiness */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recruitment Funnel */}
          <Card variant="raised" className="lg:col-span-2 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#F1F0F7]">
              <div>
                <h2 className="text-lg font-black text-[#25243A]">Recruitment Funnel Pipeline</h2>
                <p className="text-xs text-[#6F6D82]">Stage progression across all received job applications</p>
              </div>
              <span className="text-xs font-bold text-[#6C5CE7] bg-[#EDE9FE] px-3 py-1 rounded-xl border border-[#DDD6FE]">
                {metrics.totalApplications} total applicants
              </span>
            </div>

            {/* Stages */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#F8F7FD] border border-[#E8E7F2] text-center">
                <span className="text-[10px] font-black text-[#6F6D82] uppercase tracking-wider block mb-1">
                  1. Applied
                </span>
                <span className="text-xl font-black text-[#25243A]">{pipeline.pending}</span>
                <span className="text-[10px] font-bold text-[#9D9BB1] block mt-0.5">Pending</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#E8F4FF] border border-[#BFDBFE] text-center">
                <span className="text-[10px] font-black text-[#2563EB] uppercase tracking-wider block mb-1">
                  2. Reviewed
                </span>
                <span className="text-xl font-black text-[#1E40AF]">{pipeline.reviewed}</span>
                <span className="text-[10px] font-bold text-[#2563EB] block mt-0.5">Screened</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] text-center">
                <span className="text-[10px] font-black text-[#6C5CE7] uppercase tracking-wider block mb-1">
                  3. Shortlist
                </span>
                <span className="text-xl font-black text-[#5146C7]">{pipeline.shortlisted}</span>
                <span className="text-[10px] font-bold text-[#6C5CE7] block mt-0.5">Selected</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#E8F4FF] border border-[#BAE6FD] text-center">
                <span className="text-[10px] font-black text-[#0284C7] uppercase tracking-wider block mb-1">
                  4. Interview
                </span>
                <span className="text-xl font-black text-[#0369A1]">{pipeline.interview ?? 0}</span>
                <span className="text-[10px] font-bold text-[#0284C7] block mt-0.5">Meeting</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#E6F9F0] border border-[#A7F3D0] text-center">
                <span className="text-[10px] font-black text-[#059669] uppercase tracking-wider block mb-1">
                  5. Hired
                </span>
                <span className="text-xl font-black text-[#065F46]">{pipeline.accepted}</span>
                <span className="text-[10px] font-bold text-[#059669] block mt-0.5">Offers</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8F7FD] border border-[#E8E7F2] text-center">
                <span className="text-[10px] font-black text-[#6F6D82] uppercase tracking-wider block mb-1">
                  Declined
                </span>
                <span className="text-xl font-black text-[#25243A]">{pipeline.rejected}</span>
                <span className="text-[10px] font-bold text-[#9D9BB1] block mt-0.5">Archived</span>
              </div>
            </div>

            {/* Recruiter Insights Bar */}
            <div className="mt-6 p-4 rounded-2xl bg-[#F8F7FD] border border-[#E8E7F2]">
              <div className="flex items-start gap-2.5">
                <Sparkles className="h-4.5 w-4.5 text-[#6C5CE7] shrink-0 mt-0.5" />
                <div className="text-xs text-[#25243A] space-y-1">
                  {recruitmentInsights.insights.map((insight, idx) => (
                    <p key={idx} className="font-bold">
                      {insight}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Company Profile Readiness Card */}
          <Card variant="raised" className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-black text-[#25243A]">Company Profile</h2>
                  <p className="text-xs text-[#6F6D82]">Brand readiness for candidates</p>
                </div>
                <span className="text-2xl font-black text-[#6C5CE7] bg-[#EDE9FE] px-3 py-1 rounded-2xl border border-[#DDD6FE]">
                  {companyReadiness.percentage}%
                </span>
              </div>

              <div className="w-full bg-[#E8E7F2] rounded-full h-3 mb-5 overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-[#7C6EF8] to-[#6C5CE7] h-full rounded-full transition-all duration-500 shadow-xs"
                  style={{ width: `${companyReadiness.percentage}%` }}
                />
              </div>

              {companyReadiness.missingItems.length > 0 ? (
                <div className="space-y-2 mb-4">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#6F6D82] block">
                    Missing brand signals:
                  </span>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {companyReadiness.missingItems.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-bold text-[#6F6D82] bg-[#F8F7FD] p-2 rounded-xl border border-[#E8E7F2]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FFB84D] shrink-0" />
                        <span>Add {item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-[#E6F9F0] rounded-2xl border border-[#A7F3D0] text-xs text-[#065F46] font-bold flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0" />
                  <span>Company profile is 100% complete and verified!</span>
                </div>
              )}
            </div>

            <Link to="/employer/company/edit" className="block pt-2">
              <Button variant="outline" className="w-full justify-center">
                <Building2 className="h-4 w-4 mr-1.5 text-[#6C5CE7]" />
                <span>Complete Company Profile</span>
              </Button>
            </Link>
          </Card>
        </div>

        {/* Candidates Needing Attention (Interactive Review Queue) */}
        <Card variant="raised" className="p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#F1F0F7]">
            <div>
              <h2 className="text-xl font-black text-[#25243A] tracking-tight">
                Candidates Needing Attention
              </h2>
              <p className="text-xs text-[#6F6D82] mt-0.5">
                Screen and transition applicants with 1-click recruitment actions
              </p>
            </div>
            <span className="text-xs font-bold text-[#6C5CE7] bg-[#EDE9FE] px-3 py-1 rounded-xl border border-[#DDD6FE]">
              {candidatesNeedingAttention.length} in queue
            </span>
          </div>

          {candidatesNeedingAttention.length > 0 ? (
            <div className="space-y-3.5">
              {candidatesNeedingAttention.map((candidate) => (
                <div
                  key={candidate.applicationId}
                  className="clay-card p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#6C5CE7]/30 transition-all"
                >
                  <div className="flex items-start gap-3.5">
                    <Avatar
                      src={candidate.applicantAvatar}
                      name={candidate.applicantName}
                      size="md"
                      shape="rounded"
                    />

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-sm sm:text-base text-[#25243A]">
                          {candidate.applicantName}
                        </span>
                        {candidate.isViewedByEmployer === false && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-[#FF6B81] text-white shadow-xs">
                            NEW
                          </span>
                        )}
                        <Badge
                          variant={candidate.status === 'pending' ? 'warning' : 'primary'}
                        >
                          {candidate.status.toUpperCase()}
                        </Badge>
                        {candidate.matchScore !== undefined && candidate.matchScore > 0 && (
                          <Badge variant="success" className="gap-1">
                            <Sparkles className="h-3 w-3" />
                            <span>{candidate.matchScore}% Match</span>
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs font-semibold text-[#6F6D82] mt-1">
                        <span>Applied for: <strong>{candidate.jobTitle}</strong></span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(candidate.appliedAt), { addSuffix: true })}</span>
                      </div>

                      {candidate.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {candidate.skills.slice(0, 4).map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2.5 py-0.5 bg-[#F8F7FD] text-[11px] font-bold text-[#6F6D82] rounded-lg border border-[#E8E7F2]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 1-Click Status Actions with concurrency guard */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0 flex-wrap">
                    <Link to={`/employer/applicants/${candidate.applicationId}`}>
                      <Button variant="outline" size="sm" className="text-xs">
                        View Profile
                      </Button>
                    </Link>

                    {/* Only show valid transitions per state machine */}
                    {candidate.status === 'pending' && (
                      <Button
                        variant="soft"
                        size="sm"
                        disabled={updateStatusMutation.isPending}
                        onClick={() => handleStatusChange(candidate.applicationId, 'reviewed')}
                        className="text-xs"
                      >
                        Mark Reviewed
                      </Button>
                    )}

                    {candidate.status === 'reviewed' && (
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={updateStatusMutation.isPending}
                        onClick={() => handleStatusChange(candidate.applicationId, 'shortlisted')}
                        className="text-xs shadow-xs"
                      >
                        Shortlist
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={updateStatusMutation.isPending}
                      onClick={() => openRejectConfirmation(candidate.applicationId, candidate.applicantName)}
                      className="text-xs text-[#FF6B81] hover:bg-[#FFEBF0] hover:border-[#FF6B81]"
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center max-w-sm mx-auto">
              <div className="h-14 w-14 rounded-2xl bg-[#E6F9F0] text-[#059669] flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="text-base font-black text-[#25243A] mb-1">Queue is Clear</h3>
              <p className="text-xs text-[#6F6D82]">All incoming applications have been screened.</p>
            </div>
          )}
        </Card>

        {/* Active Job Postings Performance Table */}
        <Card variant="raised" className="p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#F1F0F7]">
            <div>
              <h2 className="text-xl font-black text-[#25243A] tracking-tight">
                Job Postings Performance
              </h2>
              <p className="text-xs text-[#6F6D82] mt-0.5">
                Active listings and live application tracking
              </p>
            </div>
            <Link to="/employer/jobs" className="text-xs font-bold text-[#6C5CE7] hover:underline flex items-center gap-1">
              <span>View all listings</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {jobPerformance.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E8E7F2] text-[#6F6D82] font-black uppercase tracking-wider">
                    <th className="pb-3.5 font-bold">Job Title</th>
                    <th className="pb-3.5 font-bold">Work Mode</th>
                    <th className="pb-3.5 font-bold">Status</th>
                    <th className="pb-3.5 font-bold text-center">Applications</th>
                    <th className="pb-3.5 font-bold text-center">Views</th>
                    <th className="pb-3.5 font-bold text-center">Conversion</th>
                    <th className="pb-3.5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F0F7]">
                  {jobPerformance.map((job) => (
                    <tr key={job.jobId} className="hover:bg-[#F8F7FD] transition-colors">
                      <td className="py-4 font-black text-[#25243A]">
                        <Link to={`/jobs/${job.jobId}`} className="hover:text-[#6C5CE7]">
                          {job.title}
                        </Link>
                        <span className="block text-[11px] font-normal text-[#6F6D82]">{job.location}</span>
                      </td>
                      <td className="py-4 capitalize text-[#6F6D82] font-semibold">{job.workMode}</td>
                      <td className="py-4">
                        <Badge variant={job.status === 'active' ? 'success' : 'neutral'}>
                          {job.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-4 text-center font-black text-[#25243A]">
                        {job.applicationsCount}
                      </td>
                      <td className="py-4 text-center font-bold text-[#6F6D82]">
                        {job.viewsCount}
                      </td>
                      <td className="py-4 text-center">
                        {job.conversionRate !== undefined ? (
                          <span className="font-bold text-[#059669]">{job.conversionRate}%</span>
                        ) : (
                          <span className="text-[#9D9BB1]">N/A</span>
                        )}
                      </td>
                      <td className="py-4 text-right space-x-2">
                        <Link to={`/employer/jobs/${job.jobId}/applicants`}>
                          <Button variant="outline" size="sm" className="text-xs">
                            Applicants ({job.applicationsCount})
                          </Button>
                        </Link>
                        <Link to={`/employer/jobs/${job.jobId}/edit`}>
                          <Button variant="ghost" size="sm" className="text-xs">
                            Edit
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center max-w-sm mx-auto">
              <div className="h-14 w-14 rounded-2xl bg-[#EDE9FE] text-[#6C5CE7] flex items-center justify-center mx-auto mb-3">
                <Briefcase className="h-7 w-7" />
              </div>
              <h3 className="text-base font-black text-[#25243A] mb-1">No Jobs Posted Yet</h3>
              <p className="text-xs text-[#6F6D82] mb-4">
                Publish your first job opening to start attracting and evaluating qualified talent.
              </p>
              <Link to="/employer/jobs/create">
                <Button size="sm" variant="primary">
                  <Plus className="h-4 w-4 mr-1.5" />
                  <span>Create First Job</span>
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>

      {/* Confirmation Modal for Candidate Rejection */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Confirm Candidate Decline"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#6F6D82] leading-relaxed">
            Are you sure you want to decline <strong>{selectedCandidateName}</strong>? This will update their application status to declined.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmReject}
              disabled={updateStatusMutation.isPending}
              loading={updateStatusMutation.isPending}
            >
              Confirm Decline
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default EmployerDashboard;
