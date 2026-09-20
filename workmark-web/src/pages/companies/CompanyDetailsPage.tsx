import { useParams, Link } from 'react-router-dom';
import { MapPin, Globe, Users, Calendar, CheckCircle2, Briefcase, ArrowLeft } from 'lucide-react';
import { useCompany } from '../../hooks/useCompanies';
import { useJobs } from '../../hooks/useJobs';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { JobCard } from '../../components/jobs/JobCard';
import { PublicLayout } from '../../components/layout/PublicLayout';

const CompanyDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: company, isLoading: companyLoading } = useCompany(id);
  const { data: jobsData, isLoading: jobsLoading } = useJobs();

  if (companyLoading) {
    return (
      <PublicLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </PublicLayout>
    );
  }

  if (!company) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="clay-card rounded-3xl p-12 bg-white text-center">
            <EmptyState
              icon={<Briefcase className="w-12 h-12 text-[#6C5CE7]" />}
              title="Company Not Found"
              description="The company profile you're looking for doesn't exist or is currently unavailable."
            />
          </div>
        </div>
      </PublicLayout>
    );
  }

  // Filter jobs belonging to this company if matching
  const allJobs = jobsData?.data || [];
  const companyJobs = allJobs.filter((j) => {
    if (typeof j.companyId === 'object' && j.companyId !== null) {
      return (j.companyId as { _id?: string })._id === company._id;
    }
    return j.companyId === company._id;
  });

  return (
    <PublicLayout>
      <div className="min-h-screen bg-[#F7F7FB] pb-16">
        {/* Cover Image */}
        <div className="h-64 sm:h-72 bg-gradient-to-r from-[#5146C7] via-[#6C5CE7] to-[#8ED8FF] relative overflow-hidden shadow-inner">
          {company.coverImage && (
            <img
              src={company.coverImage}
              alt={`${company.name} cover`}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
            <Link
              to="/companies"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-[#25243A] text-xs font-bold backdrop-blur-md transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Directory</span>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Company Header Card */}
              <Card className="p-6 sm:p-8 clay-card-raised border border-white/80 rounded-3xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  {/* Logo */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-3xl border-2 border-white flex items-center justify-center flex-shrink-0 shadow-[0_8px_20px_rgba(0,0,0,0.08)] p-2">
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="w-full h-full object-contain rounded-2xl"
                      />
                    ) : (
                      <span className="text-3xl sm:text-4xl font-black text-[#6C5CE7]">
                        {company.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Company Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h1 className="text-2xl sm:text-3xl font-black text-[#25243A]">{company.name}</h1>
                      {company.verified && (
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EDE9FE] text-[#6C5CE7] border border-[#DDD6FE] text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 fill-[#6C5CE7] text-white" />
                          <span>Verified</span>
                        </div>
                      )}
                    </div>

                    {company.industry && (
                      <Badge variant="default" className="mb-4 bg-[#F1EEFC] text-[#6C5CE7] border border-[#DDD6FE]">
                        {company.industry}
                      </Badge>
                    )}

                    <div className="flex flex-wrap gap-4 text-xs sm:text-sm font-medium text-[#6C6A84]">
                      {company.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-[#6C5CE7]" />
                          <span>{company.location}</span>
                        </div>
                      )}
                      {company.website && (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[#6C5CE7] hover:underline font-bold"
                        >
                          <Globe className="w-4 h-4" />
                          <span>Visit Website</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* About Section */}
              <Card className="p-6 sm:p-8 clay-card-raised border border-white/80 rounded-3xl">
                <h2 className="text-xl font-black text-[#25243A] mb-4 flex items-center gap-2">
                  <span>About {company.name}</span>
                </h2>
                <p className="text-sm sm:text-base text-[#6C6A84] leading-relaxed whitespace-pre-wrap font-medium">
                  {company.description || 'No description provided by this company.'}
                </p>
              </Card>

              {/* Open Positions */}
              <Card className="p-6 sm:p-8 clay-card-raised border border-white/80 rounded-3xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-black text-[#25243A]">Open Positions</h2>
                    <p className="text-xs text-[#6C6A84] font-medium mt-0.5">Explore active job listings posted by {company.name}</p>
                  </div>
                  <Badge variant="primary" className="text-xs font-bold px-3 py-1">
                    {companyJobs.length} {companyJobs.length === 1 ? 'Role' : 'Roles'}
                  </Badge>
                </div>

                {jobsLoading ? (
                  <div className="flex justify-center py-10">
                    <Spinner />
                  </div>
                ) : companyJobs.length === 0 ? (
                  <div className="clay-card rounded-2xl p-8 bg-[#FAF9FE] text-center border border-[#E9E8F3]">
                    <EmptyState
                      icon={<Briefcase className="w-10 h-10 text-[#6C5CE7]" />}
                      title="No Active Job Listings"
                      description="This company currently does not have any open positions listed."
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {companyJobs.map((job) => (
                      <JobCard key={job._id} job={job} />
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 sm:p-8 clay-card-raised border border-white/80 rounded-3xl sticky top-6">
                <h3 className="text-lg font-black text-[#25243A] mb-5">Company Overview</h3>
                <div className="space-y-4">
                  {company.size && (
                    <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FAF9FE] border border-[#E9E8F3]">
                      <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center text-[#6C5CE7] shrink-0 shadow-xs">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#6C6A84]">Company Size</p>
                        <p className="text-sm font-black text-[#25243A]">{company.size}</p>
                      </div>
                    </div>
                  )}

                  {company.foundedYear && (
                    <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FAF9FE] border border-[#E9E8F3]">
                      <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] flex items-center justify-center text-[#0284C7] shrink-0 shadow-xs">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#6C6A84]">Founded Year</p>
                        <p className="text-sm font-black text-[#25243A]">{company.foundedYear}</p>
                      </div>
                    </div>
                  )}

                  {company.industry && (
                    <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FAF9FE] border border-[#E9E8F3]">
                      <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#16A34A] shrink-0 shadow-xs">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#6C6A84]">Industry Sector</p>
                        <p className="text-sm font-black text-[#25243A]">{company.industry}</p>
                      </div>
                    </div>
                  )}

                  {company.location && (
                    <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FAF9FE] border border-[#E9E8F3]">
                      <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center text-[#D97706] shrink-0 shadow-xs">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#6C6A84]">Location</p>
                        <p className="text-sm font-black text-[#25243A]">{company.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default CompanyDetailsPage;
