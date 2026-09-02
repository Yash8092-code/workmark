import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User as UserIcon } from 'lucide-react';
import { useJobApplications } from '../../hooks/useApplications';
import { useJob } from '../../hooks/useJobs';
import type { ApplicationStatus } from '../../types';

const statusColors: Record<ApplicationStatus, string> = {
  applied: 'bg-blue-100 text-blue-800',
  under_review: 'bg-yellow-100 text-yellow-800',
  shortlisted: 'bg-purple-100 text-purple-800',
  interview: 'bg-indigo-100 text-indigo-800',
  selected: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function ApplicantsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('');

  const { data: job } = useJob(id);
  const { data: applicationsData, isLoading } = useJobApplications(id, {
    status: statusFilter || undefined,
  });

  const applications = applicationsData?.data || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/employer/jobs')}
          className="flex items-center gap-2 text-[#64748B] hover:text-[#172033] mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Jobs
        </button>

        <div className="bg-white rounded-lg border border-[#E2E8F0] p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#0F2747]">{job?.title}</h1>
              <p className="text-[#64748B] mt-1">{applications.length} Applications</p>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | '')}
              className="px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="">All Status</option>
              <option value="applied">Applied</option>
              <option value="under_review">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview">Interview</option>
              <option value="selected">Selected</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-[#64748B]">Loading applications...</div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12 text-[#64748B]">No applications found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Candidate</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Applied On</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {applications.map((application) => (
                    <tr key={application._id} className="hover:bg-[#F8FAFC]">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#0F2747] flex items-center justify-center text-white">
                            <UserIcon className="w-5 h-5" />
                          </div>
                          <span className="font-medium text-[#172033]">{application.userId.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[#64748B]">{application.userId.email}</td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[application.status]}`}>
                          {application.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-[#64748B]">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => navigate(`/employer/applicants/${application._id}`)}
                          className="text-[#2563EB] hover:text-[#1D4ED8] font-medium"
                        >
                          View Details
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
