import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Briefcase, Users, Calendar, MapPin } from 'lucide-react';
import { useEmployerJobs, useDeleteJob } from '../../hooks/useJobs';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import type { JobStatus } from '../../types';
import { format } from 'date-fns';

const JobsManagementPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<JobStatus | 'all'>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const { data: jobsData, isLoading } = useEmployerJobs({
    status: activeTab === 'all' ? undefined : activeTab,
  });
  const deleteJobMutation = useDeleteJob();

  const jobs = jobsData?.data || [];

  const handleDelete = async () => {
    if (selectedJobId) {
      await deleteJobMutation.mutateAsync(selectedJobId);
      setDeleteDialogOpen(false);
      setSelectedJobId(null);
    }
  };

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'draft':
        return <Badge variant="warning">Draft</Badge>;
      case 'closed':
        return <Badge variant="error">Closed</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const tabs: { value: JobStatus | 'all'; label: string; count?: number }[] = [
    { value: 'all', label: 'All Openings' },
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Drafts' },
    { value: 'closed', label: 'Closed' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="clay-card p-6 sm:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            Job Postings Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Manage Vacancies & Pipelines
          </h1>
          <p className="text-sm font-medium text-slate-300 mt-1 max-w-xl">
            Track live applicant queues, edit open requirements, and publish new roles with real-time stage metrics.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <Link to="/employer/jobs/create">
            <Button variant="primary" size="lg" className="shadow-lg hover:shadow-xl">
              <Plus className="w-5 h-5 mr-1.5 stroke-[2.5]" />
              Post New Opening
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900/90 border border-white/10 rounded-2xl w-fit mb-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 scale-[1.02]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner size="lg" />
          <p className="text-sm font-bold text-slate-400 mt-4">Loading vacancies...</p>
        </div>
      ) : jobs.length === 0 ? (
        <Card variant="default" className="py-12">
          <EmptyState
            icon={<Briefcase className="w-12 h-12 text-cyan-400" />}
            title="No job postings found"
            description={
              activeTab === 'all'
                ? 'Create your first opening to begin receiving verified applicants.'
                : `No jobs currently in "${activeTab}" status.`
            }
            action={{
              label: 'Create Opening',
              onClick: () => navigate('/employer/jobs/create'),
            }}
          />
        </Card>
      ) : (
        <div className="clay-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Job Title & Work Mode</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Applicant Pipeline</th>
                  <th className="px-6 py-4">Posted Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-sm">
                {jobs.map((job) => (
                  <tr
                    key={job._id}
                    className="hover:bg-white/[0.04] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <Link
                          to={`/jobs/${job._id}`}
                          className="font-black text-white hover:text-cyan-400 transition-colors line-clamp-1 group-hover:underline text-base"
                        >
                          {job.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-semibold">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                            {job.location}
                          </span>
                          <span>•</span>
                          <span className="capitalize">{job.workMode || 'Remote'}</span>
                          <span>•</span>
                          <span className="capitalize">{job.employmentType || 'Full-time'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(job.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Link
                            to={`/employer/jobs/${job._id}/applicants`}
                            className="font-extrabold text-sm text-[#6C5CE7] hover:underline flex items-center gap-1.5"
                          >
                            <Users className="w-4 h-4" />
                            {job.applicationCount || 0} Total Applicants
                          </Link>
                          {(job.newApplicationsCount ?? 0) > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-[#FF6B81] text-white shadow-sm animate-pulse">
                              {job.newApplicationsCount} NEW
                            </span>
                          )}
                        </div>

                        {/* Stage Breakdown Badges */}
                        {job.stageCounts && (
                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                            <Link
                              to={`/employer/jobs/${job._id}/applicants?status=pending`}
                              className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5] hover:bg-[#FFEDD5] transition-all"
                              title="Applied Candidates"
                            >
                              Applied: {job.stageCounts.pending || 0}
                            </Link>
                            <Link
                              to={`/employer/jobs/${job._id}/applicants?status=reviewed`}
                              className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] hover:bg-[#DBEAFE] transition-all"
                              title="Reviewed Candidates"
                            >
                              Reviewed: {job.stageCounts.reviewed || 0}
                            </Link>
                            <Link
                              to={`/employer/jobs/${job._id}/applicants?status=shortlisted`}
                              className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-[#EDE9FE] text-[#6C5CE7] border border-[#DDD6FE] hover:bg-[#DDD6FE] transition-all"
                              title="Shortlisted Candidates"
                            >
                              Shortlist: {job.stageCounts.shortlisted || 0}
                            </Link>
                            <Link
                              to={`/employer/jobs/${job._id}/applicants?status=interview`}
                              className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD] hover:bg-[#BAE6FD] transition-all"
                              title="Interview Stage"
                            >
                              Interview: {job.stageCounts.interview || 0}
                            </Link>
                            <Link
                              to={`/employer/jobs/${job._id}/applicants?status=accepted`}
                              className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] hover:bg-[#A7F3D0] transition-all"
                              title="Hired Candidates"
                            >
                              Hired: {job.stageCounts.accepted || 0}
                            </Link>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        {format(new Date(job.createdAt), 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/jobs/${job._id}`}>
                          <Button variant="ghost" size="sm" title="View Public Job" className="h-9 w-9 p-0 text-slate-400 hover:text-white hover:bg-white/10">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link to={`/employer/jobs/${job._id}/edit`}>
                          <Button variant="ghost" size="sm" title="Edit Job" className="h-9 w-9 p-0 text-cyan-400 hover:bg-cyan-500/10">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Delete Job"
                          className="h-9 w-9 p-0 text-[#FF6B81] hover:bg-[#FF6B81]/10"
                          onClick={() => {
                            setSelectedJobId(job._id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Job Posting"
        message="Are you sure you want to delete this job posting? All applicants, stages, and scheduled interviews linked to this opening will be permanently removed."
        confirmText="Delete Posting"
        danger
        loading={deleteJobMutation.isPending}
      />
    </div>
  );
};

export default JobsManagementPage;
