import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, CheckCircle2, XCircle, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as adminApi from '../../api/admin';
import toast from 'react-hot-toast';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';

export default function ReportsPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const queryClient = useQueryClient();

  const { data: reportsData, isLoading } = useQuery({
    queryKey: ['admin-reports', { status: statusFilter }],
    queryFn: () => adminApi.getReports({ status: statusFilter }),
  });

  const reviewMutation = useMutation({
    mutationFn: ({ reportId, action }: { reportId: string; action: 'reviewed' | 'dismissed' }) =>
      adminApi.reviewReport(reportId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      toast.success('Report updated');
    },
    onError: () => toast.error('Failed to update report'),
  });

  const reports = reportsData?.data || [];

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
              <h1 className="text-2xl sm:text-3xl font-black text-[#25243A]">Content & Safety Reports</h1>
              <p className="text-xs sm:text-sm text-[#6C6A84] font-medium mt-1">
                Review flagged job openings, user complaints, and platform safety violations.
              </p>
            </div>
            <div className="text-xs font-bold text-[#6C5CE7] bg-[#EDE9FE] px-3.5 py-1.5 rounded-xl border border-[#DDD6FE] self-start sm:self-auto">
              Total Reports: {reports.length}
            </div>
          </div>
        </div>

        {/* Filter & Table */}
        <Card className="clay-card-raised bg-white border border-white/80 rounded-3xl p-6 sm:p-8">
          <div className="mb-6 max-w-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="clay-input rounded-2xl px-4 py-2.5 text-xs font-bold text-[#25243A] bg-white border border-[#E9E8F3] focus:outline-none w-full"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending Review</option>
              <option value="reviewed">Reviewed & Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <Spinner size="lg" />
            </div>
          ) : reports.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={<ShieldAlert className="w-12 h-12 text-[#6C5CE7]" />}
                title="No Reports in Queue"
                description="Everything is currently clean and verified across the platform."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E9E8F3] text-[11px] font-bold uppercase tracking-wider text-[#6C6A84]">
                    <th className="pb-3 px-4">Entity Type</th>
                    <th className="pb-3 px-4">Reason</th>
                    <th className="pb-3 px-4">Description</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 px-4">Reported On</th>
                    <th className="pb-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F0F8] text-xs font-medium">
                  {reports.map((report) => (
                    <tr key={report._id} className="hover:bg-[#FAF9FE] transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                          <span className="font-bold text-[#25243A] capitalize">{report.reportedModel}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[#25243A] font-semibold">{report.reason}</td>
                      <td className="py-4 px-4 text-[#6C6A84] max-w-xs truncate">{report.description}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            report.status === 'pending'
                              ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
                              : report.status === 'reviewed'
                              ? 'bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]'
                              : 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]'
                          }`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-[#6C6A84]">{new Date(report.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-4 text-right">
                        {report.status === 'pending' && (
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => reviewMutation.mutate({ reportId: report._id, action: 'reviewed' })}
                              className="p-2 rounded-xl bg-[#DCFCE7] text-[#16A34A] hover:bg-[#BBF7D0] transition-colors shadow-xs"
                              title="Mark as Resolved"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => reviewMutation.mutate({ reportId: report._id, action: 'dismissed' })}
                              className="p-2 rounded-xl bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] transition-colors shadow-xs"
                              title="Dismiss Report"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
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
