import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { useJob } from '../../hooks/useJobs';
import { useApply } from '../../hooks/useApplications';
import { useSaveJob, useUnsaveJob } from '../../hooks/useSavedJobs';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Textarea';
import { SimilarJobs } from '../../components/jobs/SimilarJobs';
import { Spinner } from '../../components/ui/Spinner';
import { useAuth } from '../../hooks/useAuth';
import {
  Briefcase,
  Clock,
  Building2,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Share2,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { getCountryDisplayName, getCountryFlag } from '../../utils/countries';

export const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { data: job, isLoading } = useJob(id);
  const applyMutation = useApply();
  const saveJobMutation = useSaveJob();
  const unsaveJobMutation = useUnsaveJob();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'job_seeker') {
      toast.error('Only job seekers can apply to jobs');
      return;
    }

    setIsApplying(true);
    try {
      await applyMutation.mutateAsync({
        jobId: id!,
        data: { coverLetter },
      });
      setIsApplyModalOpen(false);
      setCoverLetter('');
      toast.success('Application submitted successfully!');
    } catch (error: any) {
      // Error handled by mutation
    } finally {
      setIsApplying(false);
    }
  };

  const handleSaveToggle = () => {
    if (!id) return;
    if (isSaved) {
      unsaveJobMutation.mutate(id);
      setIsSaved(false);
      toast.success('Job removed from bookmarks');
    } else {
      saveJobMutation.mutate(id);
      setIsSaved(true);
      toast.success('Job saved to bookmarks');
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success('Job link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </PublicLayout>
    );
  }

  if (!job) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto mb-4">
            <Briefcase className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Job not found</h1>
          <p className="text-sm text-[#64748B] mb-6">This listing may have expired or been removed by the employer.</p>
          <Link to="/jobs">
            <Button className="rounded-xl">Browse Other Opportunities</Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const companyData = typeof job.companyId === 'object' ? job.companyId : null;
  const isExternal = job.isExternal || job.source === 'adzuna';
  const companyName = companyData?.name || job.companyName || 'Verified Organization';
  const companyLogo = companyData?.logo || job.companyLogo;

  const salaryMin = job.salaryMin ?? job.salary?.min;
  const salaryMax = job.salaryMax ?? job.salary?.max;
  const salaryCurrency = job.salaryCurrency || job.salary?.currency || '$';

  const countryDisplayName = getCountryDisplayName(job.country || job.countryCode);
  const countryFlag = getCountryFlag(job.country || job.countryCode);

  const formatSalary = () => {
    if (salaryMin === undefined && salaryMax === undefined) return null;
    const formatNumber = (num: number) => num.toLocaleString();
    if (salaryMin !== undefined && salaryMax !== undefined && salaryMin !== salaryMax) {
      return `${salaryCurrency}${formatNumber(salaryMin)} – ${salaryCurrency}${formatNumber(salaryMax)} / year`;
    }
    if (salaryMin !== undefined) {
      return `From ${salaryCurrency}${formatNumber(salaryMin)} / year`;
    }
    if (salaryMax !== undefined) {
      return `Up to ${salaryCurrency}${formatNumber(salaryMax)} / year`;
    }
    return null;
  };

  const formattedSalary = formatSalary();

  return (
    <PublicLayout>
      <div className="bg-[#F8FAFC] min-h-screen py-8 sm:py-10 subtle-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Card Header */}
              <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
                  <div className="flex items-start gap-4">
                    {companyLogo ? (
                      <img
                        src={companyLogo}
                        alt={companyName}
                        className="h-16 w-16 rounded-2xl object-contain border border-[#F1F5F9] bg-white p-1.5 shadow-xs flex-shrink-0"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white font-bold flex items-center justify-center text-lg shadow-xs flex-shrink-0">
                        {companyName.substring(0, 2).toUpperCase() || <Building2 className="h-7 w-7" />}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {companyData ? (
                          <Link
                            to={`/companies/${companyData._id}`}
                            className="text-sm font-bold text-[#2563EB] hover:underline"
                          >
                            {companyName}
                          </Link>
                        ) : (
                          <span className="text-sm font-bold text-[#64748B]">{companyName}</span>
                        )}

                        {isExternal ? (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            External Listing
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#2563EB] border border-blue-200">
                            Workmark Verified
                          </span>
                        )}
                      </div>

                      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-2">
                        {job.title}
                      </h1>

                      {/* Location & Country Badge */}
                      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#475569]">
                        <span className="flex items-center gap-1.5 font-semibold text-[#0F172A]">
                          <span className="text-base">{countryFlag}</span>
                          <span>{countryDisplayName}</span>
                          {job.location && job.location !== countryDisplayName && (
                            <span className="font-normal text-[#64748B]">· {job.location}</span>
                          )}
                        </span>
                        <span>•</span>
                        <span className="capitalize">{job.employmentType.replace('-', ' ')}</span>
                        <span>•</span>
                        <span className="flex items-center text-[#64748B]">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {job.createdAt
                            ? `Posted ${formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}`
                            : 'Recently posted'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions (Share + Save) */}
                  <div className="flex items-center gap-2 self-end sm:self-start">
                    <button
                      type="button"
                      onClick={handleShare}
                      title="Share job"
                      className="p-2.5 rounded-xl border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveToggle}
                      title={isSaved ? 'Unsave' : 'Save'}
                      className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                        isSaved
                          ? 'bg-blue-50 border-blue-200 text-[#2563EB]'
                          : 'border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      {isSaved ? <BookmarkCheck className="h-4 w-4 fill-current text-[#2563EB]" /> : <Bookmark className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Tags Row */}
                <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-[#F1F5F9]">
                  <Badge variant={job.workMode === 'remote' ? 'success' : job.workMode === 'hybrid' ? 'info' : 'default'}>
                    {job.workMode.charAt(0).toUpperCase() + job.workMode.slice(1)}
                  </Badge>
                  <Badge>{job.category}</Badge>
                  <Badge>{job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1)} Level</Badge>
                </div>

                {/* Salary Display */}
                {formattedSalary && (
                  <div className="py-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">Offered Compensation</p>
                    <p className="text-2xl font-black text-emerald-700 tracking-tight">
                      {formattedSalary}
                    </p>
                  </div>
                )}

                {/* Primary CTA Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  {isExternal ? (
                    <Button
                      size="lg"
                      onClick={() => job.externalUrl && window.open(job.externalUrl, '_blank', 'noopener,noreferrer')}
                      className="flex-1 justify-center rounded-xl font-bold py-3.5 shadow-lg shadow-[#0F172A]/10 bg-[#0F172A] hover:bg-[#1E293B]"
                    >
                      <span>Apply on Company Site</span>
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={() => setIsApplyModalOpen(true)}
                      className="flex-1 justify-center rounded-xl font-bold py-3.5 shadow-lg shadow-[#2563EB]/25"
                    >
                      <span>Apply with Workmark</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Why this job fits you (Personalized Fit Signals) */}
              <div className="bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white border border-blue-100 rounded-3xl p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <span className="p-1.5 rounded-lg bg-blue-600 text-white shadow-xs">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <h2 className="text-base font-bold text-[#0F172A]">Why this may fit you</h2>
                  {job.matchScore && (
                    <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-blue-600 text-white shadow-xs">
                      <Zap className="h-3 w-3 fill-current text-yellow-300" />
                      <span>{job.matchScore}% Match</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {user?.countryCode && (job.country || job.countryCode) && user.countryCode.toLowerCase() === (job.country || job.countryCode)?.toLowerCase() && (
                    <div className="flex items-start gap-2 text-xs font-medium text-[#1E293B] bg-white/80 p-3 rounded-2xl border border-blue-100">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Matches your target location preference ({countryDisplayName})</span>
                    </div>
                  )}

                  {job.workMode === 'remote' && (
                    <div className="flex items-start gap-2 text-xs font-medium text-[#1E293B] bg-white/80 p-3 rounded-2xl border border-blue-100">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Remote availability matches flexible work mode preference</span>
                    </div>
                  )}

                  <div className="flex items-start gap-2 text-xs font-medium text-[#1E293B] bg-white/80 p-3 rounded-2xl border border-blue-100">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>In-demand domain: {job.category} ({job.experienceLevel} level)</span>
                  </div>

                  {job.skills && job.skills.length > 0 && (
                    <div className="flex items-start gap-2 text-xs font-medium text-[#1E293B] bg-white/80 p-3 rounded-2xl border border-blue-100">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{job.skills.length} core technical requirements identified</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Description */}
              <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xs">
                <h2 className="text-lg font-bold text-[#0F172A] mb-4">About the Role</h2>
                <div className="prose max-w-none text-[#475569] leading-relaxed text-sm">
                  <p className="whitespace-pre-line">{job.description}</p>
                </div>
              </div>

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xs">
                  <h2 className="text-lg font-bold text-[#0F172A] mb-4">Key Responsibilities</h2>
                  <ul className="space-y-2 text-sm text-[#475569]">
                    {job.responsibilities.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB] mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements & Skills */}
              {job.skills && job.skills.length > 0 && (
                <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <h2 className="text-lg font-bold text-[#0F172A]">Target Skills & Qualifications</h2>
                    {isExternal && (
                      <span className="text-[11px] font-medium text-[#64748B] bg-[#F1F5F9] px-2.5 py-1 rounded-lg">
                        Skills detected from job description
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-[#F8FAFC] text-[#0F172A] text-xs font-semibold rounded-xl border border-[#E2E8F0]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              {/* Job Overview Card */}
              <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-[#0F172A] text-base pb-3 border-b border-[#F1F5F9]">
                  Position Snapshot
                </h3>

                <div className="space-y-3.5 text-xs sm:text-sm">
                  <div>
                    <span className="text-[#64748B] block text-xs mb-0.5">Location & Country</span>
                    <span className="font-semibold text-[#0F172A] flex items-center gap-1.5">
                      <span>{countryFlag}</span>
                      <span>{countryDisplayName}</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[#64748B] block text-xs mb-0.5">Work Mode</span>
                    <span className="font-semibold text-[#0F172A] capitalize">{job.workMode}</span>
                  </div>

                  <div>
                    <span className="text-[#64748B] block text-xs mb-0.5">Employment Type</span>
                    <span className="font-semibold text-[#0F172A] capitalize">{job.employmentType.replace('-', ' ')}</span>
                  </div>

                  <div>
                    <span className="text-[#64748B] block text-xs mb-0.5">Experience Level</span>
                    <span className="font-semibold text-[#0F172A] capitalize">{job.experienceLevel} Level</span>
                  </div>

                  <div>
                    <span className="text-[#64748B] block text-xs mb-0.5">Source</span>
                    <span className="font-semibold text-[#0F172A]">{isExternal ? 'External Aggregator (Adzuna)' : 'Workmark Direct'}</span>
                  </div>
                </div>
              </div>

              {/* Similar Jobs */}
              <SimilarJobs currentJobId={job._id} category={job.category} skills={job.skills} />
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply for this Position"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#64748B]">
            You're submitting your Workmark profile for <strong>{job.title}</strong> at <strong>{companyName}</strong>.
          </p>

          <Textarea
            label="Cover Letter / Note (Optional)"
            placeholder="Highlight your key achievements and why you're interested in this role..."
            rows={5}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsApplyModalOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleApply} loading={isApplying} className="rounded-xl font-bold shadow-md shadow-[#2563EB]/20">
              Submit Application
            </Button>
          </div>
        </div>
      </Modal>
    </PublicLayout>
  );
};
