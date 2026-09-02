import { useParams } from 'react-router-dom';
import { MapPin, Globe, Users, Calendar, CheckCircle, Briefcase } from 'lucide-react';
import { useCompany } from '../../hooks/useCompanies';
import { useJobs } from '../../hooks/useJobs';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { JobCard } from '../../components/jobs/JobCard';

const CompanyDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: company, isLoading: companyLoading } = useCompany(id);
  const { data: jobsData, isLoading: jobsLoading } = useJobs();

  if (companyLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          icon={<Briefcase className="w-12 h-12 text-[#64748B]" />}
          title="Company Not Found"
          description="The company you're looking for doesn't exist."
        />
      </div>
    );
  }

  const jobs = jobsData?.data || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Cover Image */}
      <div className="h-64 bg-gradient-to-r from-[#0F2747] to-[#2563EB] relative">
        {company.coverImage && (
          <img
            src={company.coverImage}
            alt={`${company.name} cover`}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Company Header */}
            <Card className="p-6 mb-6">
              <div className="flex items-start gap-6">
                {/* Logo */}
                <div className="w-32 h-32 bg-white rounded-lg border-2 border-[#E2E8F0] flex items-center justify-center flex-shrink-0 shadow-lg">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-full h-full object-contain p-2 rounded-lg"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-[#2563EB]">
                      {company.name.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Company Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h1 className="text-3xl font-bold text-[#172033]">{company.name}</h1>
                        {company.verified && (
                          <CheckCircle className="w-6 h-6 text-[#2563EB] fill-current" />
                        )}
                      </div>
                      {company.industry && (
                        <Badge variant="default" className="mb-3">
                          {company.industry}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-[#64748B]">
                    {company.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{company.location}</span>
                      </div>
                    )}
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-[#2563EB] transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Website</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* About Section */}
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold text-[#172033] mb-4">About</h2>
              <p className="text-[#64748B] leading-relaxed whitespace-pre-wrap">
                {company.description || 'No description available.'}
              </p>
            </Card>

            {/* Open Positions */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#172033]">Open Positions</h2>
                <Badge>{jobs.length}</Badge>
              </div>

              {jobsLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner />
                </div>
              ) : jobs.length === 0 ? (
                <EmptyState
                  icon={<Briefcase className="w-12 h-12 text-[#64748B]" />}
                  title="No Open Positions"
                  description="This company doesn't have any open positions at the moment."
                />
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-[#172033] mb-4">Company Info</h3>
              <div className="space-y-4">
                {company.size && (
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-[#64748B] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-[#64748B]">Company Size</p>
                      <p className="font-medium text-[#172033]">{company.size}</p>
                    </div>
                  </div>
                )}

                {company.foundedYear && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#64748B] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-[#64748B]">Founded</p>
                      <p className="font-medium text-[#172033]">{company.foundedYear}</p>
                    </div>
                  </div>
                )}

                {company.industry && (
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-[#64748B] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-[#64748B]">Industry</p>
                      <p className="font-medium text-[#172033]">{company.industry}</p>
                    </div>
                  </div>
                )}

                {company.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#64748B] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-[#64748B]">Location</p>
                      <p className="font-medium text-[#172033]">{company.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsPage;
