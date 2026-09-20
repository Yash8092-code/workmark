import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { useJobApplications } from '../../hooks/useApplications';
import { useJob } from '../../hooks/useJobs';
import type { ApplicationStatus } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { Avatar } from '../../components/ui/Avatar';

const statusDisplayConfig: Record<
  ApplicationStatus,
  { label: string; variant: 'warning' | 'info' | 'purple' | 'sky' | 'success' | 'neutral' }
> = {
  pending: { label: 'Applied', variant: 'warning' },
  applied: { label: 'Applied', variant: 'warning' },
  reviewed: { label: 'Reviewed', variant: 'info' },
  under_review: { label: 'Reviewed', variant: 'info' },
  shortlisted: { label: 'Shortlisted', variant: 'purple' },
  interview: { label: 'Interview', variant: 'sky' },
  accepted: { label: 'Hired / Offer', variant: 'success' },
  selected: { label: 'Hired / Offer', variant: 'success' },
  rejected: { label: 'Declined', variant: 'neutral' },
};

export default function ApplicantsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlStatus = (searchParams.get('status') as ApplicationStatus) || '';
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>(urlStatus);

  useEffect(() => {
    if (urlStatus !== statusFilter) {
      setStatusFilter(urlStatus);
    }
  }, [urlStatus]);

  const handleStatusTabChange = (newStatus: ApplicationStatus | '') => {
    setStatusFilter(newStatus);
    if (newStatus) {
      setSearchParams({ status: newStatus });
    } else {
      setSearchParams({});
    }
  };

  const { data: job, isLoading: jobLoading } = useJob(id);
  const { data: applicationsData, isLoading: appsLoading } = useJobApplications(id, {
    status: statusFilter || undefined,
  });

  const applications = applicationsData?.data || [];

  const stageTabs: { value: ApplicationStatus | ''; label: string }[] = [
    { value: '', label: 'All Candidates' },
    { value: 'pending', label: 'Applied' },
    { value: 'reviewed', label: 'Reviewed' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'interview', label: 'Interview' },
    { value: 'accepted', label: 'Hired' },
    { value: 'rejected', label: 'Declined' },
  ];

  return (
    <div className="min-h-screen bg-[#080C15] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/employer/jobs')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-400 hover:text-cyan-400 mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Manage Jobs</span>
        </button>

        <div className="bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl rounded-2xl p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <Badge variant="purple">Candidate Pipeline</Badge>
                {job?.location && (
                  <span className="text-xs font-bold text-[#6F6D82]">📍 {job.location}</span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {jobLoading ? 'Loading Job...' : job?.title || 'Job Candidates'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                {applications.length} candidate{applications.length === 1 ? '' : 's'}{' '}
                {statusFilter ? `in "${statusFilter}" stage` : 'total'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link to={`/jobs/${id}`} target="_blank">
                <Button variant="outline" size="sm" className="text-xs">
                  View Public Listing
                </Button>
              </Link>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-white/[0.08]">
            {stageTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleStatusTabChange(tab.value)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === tab.value
                    ? 'clay-pill-active'
                    : 'clay-pill-inactive'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {appsLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Spinner size="lg" />
              <p className="text-xs font-bold text-slate-400">Loading candidate roster...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="clay-card-inset text-center py-14 px-6 rounded-2xl max-w-md mx-auto my-6">
              <div className="h-12 w-12 rounded-2xl bg-[#EDE9FE] text-[#6C5CE7] flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black text-white mb-1">No candidates in this stage</h3>
              <p className="text-xs text-slate-400 mb-4">
                {statusFilter
                  ? `There are no applicants currently marked as ${statusFilter}.`
                  : 'No one has applied to this job posting yet.'}
              </p>
              {statusFilter && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusTabChange('')}
                >
                  Show All Candidates
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08] text-slate-400 font-black uppercase tracking-wider">
                    <th className="pb-3.5 px-3 font-bold">Candidate</th>
                    <th className="pb-3.5 px-3 font-bold">Contact Email</th>
                    <th className="pb-3.5 px-3 font-bold">Status</th>
                    <th className="pb-3.5 px-3 font-bold">Applied Date</th>
                    <th className="pb-3.5 px-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {applications.map((application) => {
                    const applicantUser = (application.applicantId as any) || application.userId;
                    const applicantName = applicantUser?.name || 'Applicant';
                    const applicantEmail = applicantUser?.email || '—';
                    const statusConfig =
                      statusDisplayConfig[application.status] || statusDisplayConfig.pending;

                    return (
                      <tr
                        key={application._id}
                        className="hover:bg-white/[0.04] transition-colors group"
                      >
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={applicantUser?.avatar}
                              name={applicantName}
                              size="md"
                              shape="rounded"
                            />
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-black text-sm text-white">
                                  {applicantName}
                                </span>
                                {application.isViewedByEmployer === false && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-[#FF6B81] text-white shadow-xs">
                                    NEW
                                  </span>
                                )}
                              </div>
                              {application.profile?.headline && (
                                <p className="text-[11px] text-slate-400 font-medium">
                                  {application.profile.headline}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-3 text-slate-400 font-semibold">
                          {applicantEmail}
                        </td>

                        <td className="py-4 px-3">
                          <Badge variant={statusConfig.variant}>
                            {statusConfig.label}
                          </Badge>
                        </td>

                        <td className="py-4 px-3 text-slate-400 font-medium">
                          {new Date(application.createdAt || application.appliedAt || '').toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>

                        <td className="py-4 px-3 text-right">
                          <Link to={`/employer/applicants/${application._id}`}>
                            <Button
                              variant="primary"
                              size="sm"
                              className="text-xs shadow-xs"
                            >
                              Review Candidate
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
