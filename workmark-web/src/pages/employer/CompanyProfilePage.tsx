import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useMyCompany } from '../../hooks/useCompanies';
import { useEmployerJobs } from '../../hooks/useJobs';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import {
  Building2,
  MapPin,
  Globe,
  Users,
  Calendar,
  CheckCircle2,
  Briefcase,
  Edit3,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const CompanyProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: company, isLoading: isCompanyLoading } = useMyCompany();
  const { data: jobsData, isLoading: isJobsLoading } = useEmployerJobs({ status: 'active' });

  if (isCompanyLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!company) {
    return (
      <DashboardLayout>
        <div className="max-w-xl mx-auto my-12 text-center clay-card-raised p-8 sm:p-12">
          <div className="h-20 w-20 rounded-3xl bg-[#EDE9FE] text-[#6C5CE7] flex items-center justify-center mx-auto mb-5 shadow-xs">
            <Building2 className="h-10 w-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#25243A] mb-2 tracking-tight">
            Set Up Your Organization Profile
          </h1>
          <p className="text-xs sm:text-sm text-[#6F6D82] mb-8 leading-relaxed max-w-md mx-auto">
            Create your company profile to brand your job listings, present your culture, and start receiving qualified candidate applications.
          </p>
          <Button
            size="lg"
            variant="primary"
            onClick={() => navigate('/employer/company/create')}
            className="shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Company Profile
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const activeJobs = jobsData?.data || [];
  const logoUrl = company.logoUrl || company.logo;
  const coverUrl = company.coverUrl || company.coverImage;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Company Banner & Profile Header */}
        <Card variant="raised" className="overflow-hidden p-0 border border-[#E8E7F2]">
          {/* Cover Banner */}
          <div className="h-44 sm:h-56 bg-gradient-to-r from-[#5146C7] via-[#6C5CE7] to-[#8ED8FF] relative">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={`${company.name} cover banner`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-30 text-white">
                <Building2 className="h-24 w-24" />
              </div>
            )}
          </div>

          <div className="px-6 sm:px-8 pb-8 pt-2 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 mb-5 gap-4">
              {/* Logo */}
              <div className="w-28 h-28 sm:w-36 sm:h-36 bg-white rounded-3xl p-2 shadow-xl border-4 border-white flex items-center justify-center overflow-hidden flex-shrink-0 clay-card">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={company.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#6C5CE7] to-[#5146C7] text-white font-black text-3xl flex items-center justify-center">
                    {company.name.substring(0, 2).toUpperCase() || <Building2 className="h-10 w-10" />}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => navigate('/employer/company/edit')}
                  className="rounded-2xl"
                >
                  <Edit3 className="h-4 w-4 mr-2 text-[#6C5CE7]" />
                  Edit Company Profile
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/employer/jobs/create')}
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Post Job
                </Button>
              </div>
            </div>

            {/* Title & Industry */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-[#25243A] tracking-tight">
                  {company.name}
                </h1>
                {company.verified && (
                  <Badge variant="success" size="md" className="gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Employer</span>
                  </Badge>
                )}
              </div>
              {company.industry && (
                <Badge variant="purple" size="md">
                  {company.industry}
                </Badge>
              )}
            </div>

            {/* Metadata Badges */}
            <div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm text-[#6F6D82] pt-4 border-t border-[#F1F0F7]">
              {company.location && (
                <span className="flex items-center gap-1.5 font-bold text-[#25243A]">
                  <MapPin className="h-4 w-4 text-[#6C5CE7]" />
                  <span>{company.location}</span>
                </span>
              )}

              {(company.size || company.companySize) && (
                <span className="flex items-center gap-1.5 font-bold text-[#25243A]">
                  <Users className="h-4 w-4 text-[#6C5CE7]" />
                  <span>{company.size || company.companySize} employees</span>
                </span>
              )}

              {company.foundedYear && (
                <span className="flex items-center gap-1.5 font-bold text-[#25243A]">
                  <Calendar className="h-4 w-4 text-[#6C5CE7]" />
                  <span>Founded {company.foundedYear}</span>
                </span>
              )}

              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 font-bold text-[#6C5CE7] hover:underline"
                >
                  <Globe className="h-4 w-4" />
                  <span>Official Website</span>
                </a>
              )}
            </div>
          </div>
        </Card>

        {/* Two-Column Details & Active Opportunities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column: About & Active Jobs */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Organization */}
            <Card variant="raised" className="p-6 sm:p-8">
              <h2 className="text-lg font-black text-[#25243A] mb-3 flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-[#6C5CE7]" />
                <span>About the Organization</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#6F6D82] leading-relaxed whitespace-pre-line">
                {company.description ||
                  'No description added yet. Edit your organization profile to tell candidates about your mission, values, and engineering culture.'}
              </p>
            </Card>

            {/* Active Opportunities */}
            <Card variant="raised" className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-black text-[#25243A]">Active Opportunities</h2>
                  <p className="text-xs text-[#6F6D82]">Live postings receiving talent traffic</p>
                </div>
                <Badge variant="purple" size="md">
                  {activeJobs.length} Live Openings
                </Badge>
              </div>

              {isJobsLoading ? (
                <div className="py-8 flex justify-center">
                  <Spinner />
                </div>
              ) : activeJobs.length === 0 ? (
                <div className="clay-card-inset p-8 text-center rounded-2xl">
                  <Briefcase className="h-8 w-8 text-[#9D9BB1] mx-auto mb-2" />
                  <p className="text-sm font-bold text-[#25243A] mb-1">No active job postings</p>
                  <p className="text-xs text-[#6F6D82] mb-4">
                    Publish your open roles to start attracting qualified candidates.
                  </p>
                  <Button size="sm" variant="primary" onClick={() => navigate('/employer/jobs/create')}>
                    Create Job Posting
                  </Button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {activeJobs.map((job) => (
                    <div
                      key={job._id}
                      className="clay-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#6C5CE7]/30 transition-all"
                    >
                      <div>
                        <Link
                          to={`/jobs/${job._id}`}
                          className="font-black text-sm sm:text-base text-[#25243A] hover:text-[#6C5CE7] transition-colors"
                        >
                          {job.title}
                        </Link>
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#6F6D82] mt-1 flex-wrap">
                          <span className="capitalize">{job.workMode}</span>
                          <span>•</span>
                          <span className="capitalize">{job.employmentType.replace('-', ' ')}</span>
                          <span>•</span>
                          <span>{job.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
                        <Link to={`/employer/jobs/${job._id}/applicants`}>
                          <Button variant="outline" size="sm" className="text-xs">
                            View Applicants ({job.applicationCount || 0})
                          </Button>
                        </Link>
                        <Link to={`/employer/jobs/${job._id}/edit`}>
                          <Button variant="ghost" size="sm" className="text-xs">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar Snapshot */}
          <div className="space-y-6">
            <Card variant="raised" className="p-6 space-y-5">
              <h3 className="text-base font-black text-[#25243A]">Recruitment Snapshot</h3>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#F8F7FD] border border-[#E8E7F2] flex items-center justify-between">
                  <span className="font-bold text-[#6F6D82]">Active Job Postings:</span>
                  <strong className="text-sm font-black text-[#25243A]">{activeJobs.length}</strong>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F8F7FD] border border-[#E8E7F2] flex items-center justify-between">
                  <span className="font-bold text-[#6F6D82]">Verification Status:</span>
                  <Badge variant={company.verified ? 'success' : 'warning'}>
                    {company.verified ? 'Verified' : 'Pending Review'}
                  </Badge>
                </div>
              </div>

              <div className="pt-2">
                <Link to="/employer/dashboard" className="w-full block">
                  <Button variant="secondary" className="w-full justify-center">
                    <span>Recruitment Command Center</span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CompanyProfilePage;
