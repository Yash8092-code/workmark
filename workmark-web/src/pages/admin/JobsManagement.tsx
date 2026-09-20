import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Trash2, Star, Briefcase, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as adminApi from '../../api/admin';
import toast from 'react-hot-toast';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';

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
    <div className="min-h-screen bg-[#F7F7FB] py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="clay-card-raised bg-white border border-white/80 rounded-3xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Link to="/admin" className="inline-flex items-center gap-1 text-xs font-bold text-[#6C5CE7] hover:underline mb-2">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Admin Hub</span>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-black text-[#25243A]">Job Postings Audit</h1>
              <p className="text-xs sm:text-sm text-[#6C6A84] font-medium mt-1">
                Monitor live job listings across all companies, applications, and remove non-compliant postings.
              </p>
            </div>
            <div className="text-xs font-bold text-[#6C5CE7] bg-[#EDE9FE] px-3.5 py-1.5 rounded-xl border border-[#DDD6FE] self-start sm:self-auto">
              Total Openings: {jobs.length}
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <Card className="clay-card-raised bg-white border border-white/80 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs by title or category..."
                icon={<Search className="w-4 h-4 text-[#6C6A84]" />}
                className="rounded-2xl"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="clay-input rounded-2xl px-4 py-2.5 text-xs font-bold text-[#25243A] bg-white border border-[#E9E8F3] focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <Spinner size="lg" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={<Briefcase className="w-12 h-12 text-[#6C5CE7]" />}
                title="No Job Postings Found"
                description="Try changing the filter settings or search query."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E9E8F3] text-[11px] font-bold uppercase tracking-wider text-[#6C6A84]">
                    <th className="pb-3 px-4">Job Title</th>
                    <th className="pb-3 px-4">Company</th>
                    <th className="pb-3 px-4">Category</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 px-4">Applications</th>
                    <th className="pb-3 px-4">Posted</th>
                    <th className="pb-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F0F8] text-xs font-medium">
                  {jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-[#FAF9FE] transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 font-bold text-[#25243A] text-sm">
                          {job.featured && <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />}
                          <span>{job.title}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[#6C6A84] font-semibold">
                        {typeof job.companyId === 'object' && job.companyId !== null
                          ? (job.companyId as { name?: string }).name || '—'
                          : '—'}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EDE9FE] text-[#6C5CE7] border border-[#DDD6FE]">
                          {job.category}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            job.status === 'active'
                              ? 'bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]'
                              : job.status === 'closed'
                              ? 'bg-[#FFE4E6] text-[#E11D48] border-[#FECDD3]'
                              : 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]'
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-[#25243A]">{job.applicationCount || 0}</td>
                      <td className="py-4 px-4 text-[#6C6A84]">{new Date(job.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to remove this job posting?')) {
                              removeJobMutation.mutate(job._id);
                            }
                          }}
                          className="p-2 rounded-xl bg-[#FFE4E6] text-[#E11D48] hover:bg-[#FECDD3] transition-colors shadow-xs"
                          title="Remove Job Posting"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
