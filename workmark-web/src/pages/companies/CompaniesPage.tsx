import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { useCompanies } from '../../hooks/useCompanies';
import { Input } from '../../components/ui/Input';
import { Pagination } from '../../components/ui/Pagination';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Building2, MapPin, Briefcase, Search, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export const CompaniesPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useCompanies({ page, limit: 12, search });

  return (
    <PublicLayout>
      <div className="bg-[#080C15] min-h-screen py-10 text-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="genz-card border border-white/10 rounded-3xl p-8 sm:p-12 mb-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-cyan-500/10 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Company Directory</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-3">
                Discover Leading Organizations
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
                Explore company profiles, workplace culture, verified standards, and active job openings across tech, design, finance, and engineering.
              </p>
            </div>

            {/* Search Input */}
            <div className="mt-8 max-w-xl relative z-10">
              <Input
                type="text"
                placeholder="Search companies by name, industry, or domain..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                icon={<Search className="h-4 w-4 text-slate-400" />}
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
            <div className="genz-card rounded-3xl p-12 text-center border border-white/10">
              <EmptyState
                icon={<Building2 className="h-12 w-12 text-cyan-400" />}
                title="No companies found"
                description="Try adjusting your search query or clear the filter."
              />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.data.map((company) => (
                  <Link key={company._id} to={`/companies/${company._id}`} className="group block">
                    <div className="h-full genz-card border border-white/10 hover:border-cyan-500/40 rounded-3xl p-6 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between shadow-lg">
                      <div>
                        <div className="flex items-start gap-4 mb-4">
                          {company.logo ? (
                            <img
                              src={company.logo}
                              alt={company.name}
                              className="h-14 w-14 rounded-2xl object-contain border border-white/10 bg-slate-900 p-1.5 flex-shrink-0"
                            />
                          ) : (
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-white font-black flex items-center justify-center text-lg shadow-md flex-shrink-0">
                              {company.name.substring(0, 2).toUpperCase()}
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-bold text-white group-hover:text-cyan-300 transition-colors truncate text-base">
                                {company.name}
                              </h3>
                              {company.verified && (
                                <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                              )}
                            </div>

                            {company.industry && (
                              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                                {company.industry}
                              </span>
                            )}
                          </div>
                        </div>

                        {company.description && (
                          <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed font-medium">
                            {company.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-medium">
                        {company.location ? (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                            <span className="truncate max-w-[140px]">{company.location}</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <Briefcase className="h-3.5 w-3.5 text-cyan-400" />
                            <span>Active Hiring</span>
                          </span>
                        )}

                        <span className="font-bold text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          <span>View Profile</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {data && data.pagination.pages > 1 && (
                <div className="mt-10">
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
