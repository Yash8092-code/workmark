import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, CheckCircle2, XCircle, Building2, Globe, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as companiesApi from '../../api/companies';
import * as adminApi from '../../api/admin';
import toast from 'react-hot-toast';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';

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
              <h1 className="text-2xl sm:text-3xl font-black text-[#25243A]">Company Verification</h1>
              <p className="text-xs sm:text-sm text-[#6C6A84] font-medium mt-1">
                Audit employer organizations, manage verification badges, and inspect domains.
              </p>
            </div>
            <div className="text-xs font-bold text-[#6C5CE7] bg-[#EDE9FE] px-3.5 py-1.5 rounded-xl border border-[#DDD6FE] self-start sm:self-auto">
              Total Companies: {companies.length}
            </div>
          </div>
        </div>

        {/* Search & Table */}
        <Card className="clay-card-raised bg-white border border-white/80 rounded-3xl p-6 sm:p-8">
          <div className="mb-6 max-w-md">
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies by name or industry..."
              icon={<Search className="w-4 h-4 text-[#6C6A84]" />}
              className="rounded-2xl"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <Spinner size="lg" />
            </div>
          ) : companies.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={<Building2 className="w-12 h-12 text-[#6C5CE7]" />}
                title="No Companies Found"
                description="No organization profiles match your query."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E9E8F3] text-[11px] font-bold uppercase tracking-wider text-[#6C6A84]">
                    <th className="pb-3 px-4">Company</th>
                    <th className="pb-3 px-4">Industry</th>
                    <th className="pb-3 px-4">Location</th>
                    <th className="pb-3 px-4">Size</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F0F8] text-xs font-medium">
                  {companies.map((company) => (
                    <tr key={company._id} className="hover:bg-[#FAF9FE] transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-bold text-[#25243A] text-sm">{company.name}</div>
                        {company.website && (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#6C5CE7] hover:underline text-xs flex items-center gap-1 mt-0.5"
                          >
                            <Globe className="w-3 h-3" />
                            <span>{company.website}</span>
                          </a>
                        )}
                      </td>
                      <td className="py-4 px-4 text-[#6C6A84]">{company.industry || '—'}</td>
                      <td className="py-4 px-4 text-[#6C6A84]">{company.location || '—'}</td>
                      <td className="py-4 px-4 text-[#6C6A84]">{company.size || '—'}</td>
                      <td className="py-4 px-4">
                        {company.verified ? (
                          <span className="inline-flex items-center gap-1 text-[#16A34A] bg-[#DCFCE7] border border-[#BBF7D0] px-2.5 py-1 rounded-full text-[11px] font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[#64748B] bg-[#F1F5F9] border border-[#E2E8F0] px-2.5 py-1 rounded-full text-[11px] font-bold">
                            <XCircle className="w-3.5 h-3.5" />
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button
                          variant={company.verified ? 'outline' : 'primary'}
                          size="sm"
                          onClick={() => verifyMutation.mutate(company._id)}
                          isBusy={verifyMutation.isPending}
                          className="rounded-xl text-xs font-bold px-3 py-1.5"
                        >
                          {company.verified ? 'Revoke Verification' : 'Verify Company'}
                        </Button>
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
