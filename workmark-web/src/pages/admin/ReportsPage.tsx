import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import * as adminApi from '../../api/admin';
import toast from 'react-hot-toast';

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
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#0F2747] mb-8">Reports Management</h1>

        <div className="bg-white rounded-lg border border-[#E2E8F0] p-6">
          <div className="mb-6">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-[#64748B]">Loading reports...</div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12 text-[#64748B]">No reports found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Reason</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Description</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Reported</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {reports.map((report) => (
                    <tr key={report._id} className="hover:bg-[#F8FAFC]">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-orange-500" />
                          <span className="font-medium text-[#172033]">{report.reportedModel}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[#64748B]">{report.reason}</td>
                      <td className="px-4 py-4 text-[#64748B] max-w-xs truncate">{report.description}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            report.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : report.status === 'reviewed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-[#64748B]">{new Date(report.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-4">
                        {report.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => reviewMutation.mutate({ reportId: report._id, action: 'reviewed' })}
                              className="text-green-600 hover:text-green-700"
                              title="Mark as Reviewed"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => reviewMutation.mutate({ reportId: report._id, action: 'dismissed' })}
                              className="text-gray-600 hover:text-gray-700"
                              title="Dismiss"
                            >
                              <XCircle className="w-5 h-5" />
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
        </div>
      </div>
    </div>
  );
}
