import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Trash2, Star } from 'lucide-react';
import * as adminApi from '../../api/admin';
import toast from 'react-hot-toast';

export default function JobsManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const queryClient = useQueryClient();

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['admin-jobs', { search, status: statusFilter }],
    queryFn: () => adminApi.getAdminJobs({ search, status: statusFilter }),
  });

  const removeJobMutation = useMutation({
    mutationFn: (jobId: string) => adminApi.removeJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      toast.success('Job removed');
    },
    onError: () => toast.error('Failed to remove job'),
  });

  const jobs = jobsData?.data || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#0F2747] mb-8">Job Management</h1>

        <div className="bg-white rounded-lg border border-[#E2E8F0] p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs..."
                className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-[#64748B]">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 text-[#64748B]">No jobs found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Job Title</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Company</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Applications</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Posted</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-[#F8FAFC]">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {job.featured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                          <span className="font-medium text-[#172033]">{job.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[#64748B]">{job.companyId?.name || '-'}</td>
                      <td className="px-4 py-4 text-[#64748B]">{job.category}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            job.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : job.status === 'closed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-[#64748B]">{job.applicationCount || 0}</td>
                      <td className="px-4 py-4 text-[#64748B]">{new Date(job.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to remove this job?')) {
                              removeJobMutation.mutate(job._id);
                            }
                          }}
                          className="text-red-600 hover:text-red-700"
                          title="Remove Job"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
