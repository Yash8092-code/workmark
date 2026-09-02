import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
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

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs: { value: JobStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'closed', label: 'Closed' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#172033]">Jobs Management</h1>
          <p className="text-[#64748B] mt-2">Manage your job postings</p>
        </div>
        <Link to="/employer/jobs/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create New Job
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-[#E2E8F0]">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`pb-3 px-1 font-medium transition-colors relative ${
                activeTab === tab.value
                  ? 'text-[#2563EB]'
                  : 'text-[#64748B] hover:text-[#172033]'
              }`}
            >
              {tab.label}
              {activeTab === tab.value && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={<Plus className="w-12 h-12 text-[#64748B]" />}
          title="No jobs found"
          description="Create your first job posting to get started"
          action={{
            label: 'Create Job',
            onClick: () => navigate('/employer/jobs/create'),
          }}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#172033]">
                    Job Title
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#172033]">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#172033]">
                    Applications
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#172033]">
                    Posted Date
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#172033]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <Link
                          to={`/jobs/${job._id}`}
                          className="font-medium text-[#172033] hover:text-[#2563EB]"
                        >
                          {job.title}
                        </Link>
                        <p className="text-sm text-[#64748B]">{job.location}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(job.status)}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/employer/jobs/${job._id}/applicants`}
                        className="text-[#2563EB] hover:underline"
                      >
                        {job.applicationCount || 0} applications
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-[#64748B]">
                      {format(new Date(job.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/jobs/${job._id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link to={`/employer/jobs/${job._id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedJobId(job._id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Job"
        message="Are you sure you want to delete this job? This action cannot be undone and all applications will be lost."
        confirmText="Delete"
        danger
        loading={deleteJobMutation.isPending}
      />
    </div>
  );
};

export default JobsManagementPage;
