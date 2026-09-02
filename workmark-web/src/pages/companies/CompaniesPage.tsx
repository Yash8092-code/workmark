import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { useCompanies } from '../../hooks/useCompanies';
import { Input } from '../../components/ui/Input';
import { Pagination } from '../../components/ui/Pagination';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Building2, MapPin, Briefcase, Search, CheckCircle2, ArrowRight } from 'lucide-react';

export const CompaniesPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useCompanies({ page, limit: 12, search });

  return (
    <PublicLayout>
      <div className="bg-[#F8FAFC] min-h-screen py-10 subtle-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 sm:p-10 mb-8 shadow-xs">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                  <Building2 className="h-4 w-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Company Directory</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-2">
                Discover Leading Organizations
              </h1>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Explore company profiles, workplace culture, and active job openings across tech, design, finance, and engineering.
              </p>
            </div>

            {/* Search Input */}
            <div className="mt-6 max-w-xl">
              <Input
                type="text"
                placeholder="Search companies by name, industry, or domain..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                icon={<Search className="h-4 w-4 text-[#64748B]" />}
                className="rounded-2xl"
              />
            </div>
          </div>

          {/* Companies Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : data?.data.length === 0 ? (
            <EmptyState
              icon={<Building2 className="h-12 w-12" />}
              title="No companies found"
              description="Try adjusting your search query or clear the filter"
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.data.map((company) => (
                  <Link key={company._id} to={`/companies/${company._id}`} className="group">
                    <div className="h-full bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-xs hover:shadow-lg hover:border-blue-200 hover:-translate-y-1 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-start gap-4 mb-4">
                          {company.logo ? (
                            <img
                              src={company.logo}
                              alt={company.name}
                              className="h-14 w-14 rounded-2xl object-contain border border-[#F1F5F9] bg-white p-1 shadow-xs flex-shrink-0"
                            />
                          ) : (
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white font-bold flex items-center justify-center text-base shadow-xs flex-shrink-0">
                              {company.name.substring(0, 2).toUpperCase()}
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-bold text-[#0F172A] group-hover:text-blue-600 transition-colors truncate">
                                {company.name}
                              </h3>
                              <CheckCircle2 className="h-4 w-4 text-blue-600 fill-blue-50 shrink-0" />
                            </div>

                            {company.industry && (
                              <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#F1F5F9] text-[#475569]">
                                {company.industry}
                              </span>
                            )}
                          </div>
                        </div>

                        {company.description && (
                          <p className="text-xs text-[#64748B] line-clamp-3 mb-4 leading-relaxed">
                            {company.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
                        {company.location ? (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-[#94A3B8]" />
                            <span className="truncate max-w-[140px]">{company.location}</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5 text-[#94A3B8]" />
                            <span>Active Hiring</span>
                          </span>
                        )}

                        <span className="font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                          <span>View Profile</span>
                          <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {data && data.pagination.pages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={page}
                    totalPages={data.pagination.pages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};
