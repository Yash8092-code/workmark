import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, CheckCircle, XCircle } from 'lucide-react';
import * as companiesApi from '../../api/companies';
import * as adminApi from '../../api/admin';
import toast from 'react-hot-toast';

export default function CompaniesManagement() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: companiesData, isLoading } = useQuery({
    queryKey: ['admin-companies', { search }],
    queryFn: () => companiesApi.getCompanies({ search }),
  });

  const verifyMutation = useMutation({
    mutationFn: (companyId: string) => adminApi.verifyCompany(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-companies'] });
      toast.success('Company verification status updated');
    },
    onError: () => toast.error('Failed to update company status'),
  });

  const companies = companiesData?.data || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#0F2747] mb-8">Company Management</h1>

        <div className="bg-white rounded-lg border border-[#E2E8F0] p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search companies..."
                className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-[#64748B]">Loading companies...</div>
          ) : companies.length === 0 ? (
            <div className="text-center py-12 text-[#64748B]">No companies found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Company</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Industry</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Location</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Size</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Verified</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#172033]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {companies.map((company) => (
                    <tr key={company._id} className="hover:bg-[#F8FAFC]">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-[#172033]">{company.name}</p>
                          {company.website && (
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-[#2563EB] hover:underline"
                            >
                              {company.website}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[#64748B]">{company.industry || '-'}</td>
                      <td className="px-4 py-4 text-[#64748B]">{company.location || '-'}</td>
                      <td className="px-4 py-4 text-[#64748B]">{company.size || '-'}</td>
                      <td className="px-4 py-4">
                        {company.verified ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-5 h-5" />
                            Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-gray-500">
                            <XCircle className="w-5 h-5" />
                            Not Verified
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => verifyMutation.mutate(company._id)}
                          disabled={verifyMutation.isPending}
                          className={`px-4 py-2 rounded-lg font-medium ${
                            company.verified
                              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                          }`}
                        >
                          {company.verified ? 'Unverify' : 'Verify'}
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
