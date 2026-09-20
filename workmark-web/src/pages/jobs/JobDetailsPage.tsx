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
import { useMyApplications } from '../../hooks/useApplications';
import { useProfile } from '../../hooks/useProfile';

export const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { data: job, isLoading } = useJob(id);
  const { data: profile } = useProfile();
  const { data: myAppsData } = useMyApplications({ limit: 100 });
  const applyMutation = useApply();
  const saveJobMutation = useSaveJob();
  const unsaveJobMutation = useUnsaveJob();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const existingApplication = myAppsData?.data?.find(
    (app) => (typeof app.jobId === 'object' ? app.jobId?._id : app.jobId) === id
  );
  const hasApplied = Boolean(existingApplication);

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
        data: {
          coverLetter,
          resumeUrl: profile?.resumeUrl || profile?.resume,
        },
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
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Spinner size="lg" />
          <p className="text-sm font-bold text-[#7E7C9A]">Loading job details...</p>
        </div>
      </PublicLayout>
    );
  }

  if (!job) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-[#EDE9FE] text-[#6C5CE7] flex items-center justify-center mx-auto mb-4">
            <Briefcase className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-black text-[#25243A] mb-2">Job not found</h1>
          <p className="text-sm font-medium text-[#7E7C9A] mb-6">This listing may have expired or been removed by the employer.</p>
          <Link to="/jobs">
            <Button variant="primary">Browse Other Opportunities</Button>
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
  const salaryCurrency = job.salaryCurrency || job.salary?.currency || '₹';

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
      <div className="min-h-screen py-8 sm:py-10 animate-fadeIn">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Card Header */}
              <div className="clay-card p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
                  <div className="flex items-start gap-4">
                    {companyLogo ? (
                      <img
                        src={companyLogo}
                        alt={companyName}
                        className="h-16 w-16 rounded-2xl object-contain border border-[#E6E8F2] bg-white p-1.5 shadow-sm flex-shrink-0"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#6C5CE7] to-[#5146C7] text-white font-black flex items-center justify-center text-lg shadow-sm flex-shrink-0">
                        {companyName.substring(0, 2).toUpperCase() || <Building2 className="h-7 w-7" />}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {companyData ? (
                          <Link
                            to={`/companies/${companyData._id}`}
                            className="text-sm font-black text-[#6C5CE7] hover:underline"
                          >
                            {companyName}
                          </Link>
                        ) : (
                          <span className="text-sm font-bold text-[#7E7C9A]">{companyName}</span>
                        )}

                        {isExternal ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
                            External Listing
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EDE9FE] text-[#6C5CE7] border border-[#DDD6FE]">
                            Workmark Verified
                          </span>
                        )}
                      </div>

                      <h1 className="text-2xl sm:text-3xl font-black text-[#25243A] tracking-tight mb-2">
                        {job.title}
                      </h1>

                      {/* Location & Country Badge */}
                      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#7E7C9A] font-semibold">
                        <span className="flex items-center gap-1.5 text-[#25243A] font-bold">
                          <span className="text-base">{countryFlag}</span>
                          <span>{countryDisplayName}</span>
                          {job.location && job.location !== countryDisplayName && (
                            <span className="font-medium text-[#7E7C9A]">· {job.location}</span>
                          )}
                        </span>
                        <span>•</span>
                        <span className="capitalize">{job.employmentType.replace('-', ' ')}</span>
                        <span>•</span>
                        <span className="flex items-center text-[#7E7C9A]">
                          <Clock className="h-3.5 w-3.5 mr-1 text-[#6C5CE7]" />
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
                      className="p-2.5 rounded-2xl border border-white/10 bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveToggle}
                      title={isSaved ? 'Unsave' : 'Save'}
                      className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                        isSaved
                          ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 shadow-sm'
                          : 'border-white/10 bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {isSaved ? <BookmarkCheck className="h-4 w-4 fill-current text-indigo-400" /> : <Bookmark className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Tags Row */}
                <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-[#E6E8F2]">
                  <Badge variant={job.workMode === 'remote' ? 'success' : job.workMode === 'hybrid' ? 'primary' : 'default'}>
                    {job.workMode.charAt(0).toUpperCase() + job.workMode.slice(1)}
                  </Badge>
                  <Badge variant="primary">{job.category}</Badge>
                  <Badge variant="default">{job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1)} Level</Badge>
                </div>

                {/* Salary Display */}
                {formattedSalary && (
                  <div className="py-4">
                    <p className="text-xs font-black uppercase tracking-wider text-[#7E7C9A] mb-1">Offered Compensation</p>
                    <p className="text-2xl font-black text-[#059669] tracking-tight">
                      {formattedSalary}
                    </p>
                  </div>
                )}

                {/* Primary CTA Buttons or Status Banner */}
                <div className="pt-4">
                  {hasApplied ? (
                    <div className="p-4 bg-[#EDE9FE]/50 rounded-2xl border border-[#DDD6FE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className="h-5 w-5 text-[#35C98A] shrink-0" />
                          <span className="font-black text-sm text-[#25243A]">Application Submitted</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                            existingApplication?.status === 'accepted'
                              ? 'bg-[#ECFDF5] text-[#059669]'
                              : existingApplication?.status === 'interview'
                              ? 'bg-[#EDE9FE] text-[#6C5CE7]'
                              : existingApplication?.status === 'shortlisted'
                              ? 'bg-[#EFF6FF] text-[#2563EB]'
                              : existingApplication?.status === 'rejected'
                              ? 'bg-[#FFF1F2] text-[#E11D48]'
                              : 'bg-[#FFF7ED] text-[#EA580C]'
                          }`}>
                            {existingApplication?.status === 'pending'
                              ? 'Applied / Pending'
                              : existingApplication?.status === 'reviewed'
                              ? 'Under Review'
                              : existingApplication?.status === 'accepted'
                              ? 'Accepted / Offer'
                              : existingApplication?.status?.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-[#7E7C9A]">
                          Your profile is active in this recruitment pipeline.
                        </p>
                      </div>
                      <Link to={`/seeker/applications?applicationId=${existingApplication?._id}`}>
                        <Button variant="primary" size="sm" className="shrink-0">
                          View in Applications →
                        </Button>
                      </Link>
                    </div>
                  ) : isExternal ? (
                    <Button
                      size="lg"
                      variant="primary"
                      onClick={() => job.externalUrl && window.open(job.externalUrl, '_blank', 'noopener,noreferrer')}
                      className="w-full justify-center shadow-lg"
                    >
                      <span>Apply on Company Site</span>
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      variant="primary"
                      onClick={() => setIsApplyModalOpen(true)}
                      className="w-full justify-center shadow-lg"
                    >
                      <span>Apply with Workmark</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Opportunity Intelligence Section */}
              {job.opportunityIntelligence ? (
                <div className="clay-card-dark p-6 sm:p-8 relative overflow-hidden space-y-6">
                  {/* Intel Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-black uppercase tracking-wider text-[#8ED8FF] flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5 text-[#FFB84D]" />
                          Opportunity Intelligence
                        </span>
                        <span className="text-[11px] font-bold text-white/80 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                          {job.opportunityIntelligence.matchConfidence}
                        </span>
                      </div>
                      <h2 className="text-xl font-black tracking-tight text-white">
                        Personalized Fit Assessment
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                          job.opportunityIntelligence.matchTier === 'Strong Match'
                            ? 'bg-[#35C98A]/20 text-[#35C98A] border border-[#35C98A]/30'
                            : job.opportunityIntelligence.matchTier === 'Good Match'
                            ? 'bg-[#8ED8FF]/20 text-[#8ED8FF] border border-[#8ED8FF]/30'
                            : 'bg-[#FFB84D]/20 text-[#FFB84D] border border-[#FFB84D]/30'
                        }`}>
                          {job.opportunityIntelligence.matchTier}
                        </span>
                        {job.opportunityIntelligence.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-white/90 border border-white/15">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 shrink-0 text-center">
                      <span className="text-3xl sm:text-4xl font-black text-white flex items-center">
                        {job.opportunityIntelligence.score}
                        <span className="text-lg text-[#8ED8FF] font-black ml-0.5">%</span>
                      </span>
                      <span className="text-[11px] uppercase tracking-wider font-bold text-white/80 sm:mt-0.5">
                        Match Score
                      </span>
                    </div>
                  </div>

                  {/* Should You Apply? Guidance Card */}
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 text-white">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-2xl bg-[#6C5CE7]/30 text-[#8ED8FF] shrink-0 mt-0.5">
                        <Zap className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#8ED8FF] block">
                          Application Guidance
                        </span>
                        <h3 className="text-sm font-black text-white mt-0.5">
                          {job.opportunityIntelligence.applicationGuidance.headline}
                        </h3>
                        <p className="text-xs font-medium text-white/80 mt-1 leading-relaxed">
                          {job.opportunityIntelligence.applicationGuidance.summary}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Verified Fit Signals */}
                  {job.opportunityIntelligence.fitSignals.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-black uppercase tracking-wider text-white/80 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-[#35C98A]" />
                        <span>Why This Job Fits Your Profile</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {job.opportunityIntelligence.fitSignals.map((signal, idx) => (
                          <div key={idx} className="flex items-start gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/90 font-medium">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#35C98A] mt-1.5 shrink-0" />
                            <span>{signal}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matched vs Missing Skills Split */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#065F46]/30 border border-[#35C98A]/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-[#35C98A]">Matching Profile Skills</span>
                        <span className="text-[11px] font-black text-[#35C98A]">
                          {job.opportunityIntelligence.matchingSkills.length} Verified
                        </span>
                      </div>
                      {job.opportunityIntelligence.matchingSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {job.opportunityIntelligence.matchingSkills.map((skill, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-[#065F46]/60 text-[#A7F3D0] text-xs font-bold rounded-lg border border-[#35C98A]/40">
                              ✓ {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-[#A7F3D0]/70 italic">No exact skill matches detected in profile.</p>
                      )}
                    </div>

                    <div className="p-4 rounded-2xl bg-[#5146C7]/30 border border-[#6C5CE7]/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-[#8ED8FF]">Target Growth Skills</span>
                        <span className="text-[11px] font-black text-[#8ED8FF]">
                          {job.opportunityIntelligence.missingSkills.length} Requested
                        </span>
                      </div>
                      {job.opportunityIntelligence.missingSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {job.opportunityIntelligence.missingSkills.map((skill, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-[#5146C7]/60 text-[#EDE9FE] text-xs font-bold rounded-lg border border-[#6C5CE7]/40">
                              + {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-[#EDE9FE]/70 italic">You possess all core technical requirements!</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Fallback signals when not authenticated */
                <div className="clay-card-soft p-6 sm:p-7">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="p-1.5 rounded-xl bg-[#EDE9FE] text-[#6C5CE7]">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <h2 className="text-base font-black text-[#25243A]">Opportunity Overview</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <div className="flex items-start gap-2 text-xs font-bold text-white bg-slate-900/80 p-3 rounded-2xl border border-white/10">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{job.workMode.toUpperCase()} position located in {countryDisplayName}</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs font-bold text-white bg-slate-900/80 p-3 rounded-2xl border border-white/10">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Domain: {job.category} ({job.experienceLevel} level)</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 text-xs font-semibold text-slate-400 flex items-center justify-between">
                    <span>Sign in with a job seeker profile to unlock personalized fit intelligence</span>
                    <Link to="/login" className="font-black text-cyan-400 hover:underline">
                      Sign In &rarr;
                    </Link>
                  </div>
                </div>
              )}

              {/* Job Description */}
              <div className="clay-card p-6 sm:p-8">
                <h2 className="text-lg font-black text-[#25243A] mb-4">About the Role</h2>
                <div className="text-[#25243A] font-medium leading-relaxed text-sm whitespace-pre-line">
                  {job.description}
                </div>
              </div>

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div className="clay-card p-6 sm:p-8">
                  <h2 className="text-lg font-black text-[#25243A] mb-4">Key Responsibilities</h2>
                  <ul className="space-y-2.5 text-sm font-medium text-[#25243A]">
                    {job.responsibilities.map((item, index) => (
                      <li key={index} className="flex items-start gap-2.5">
                        <span className="h-2 w-2 rounded-full bg-[#6C5CE7] mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements & Skills */}
              {job.skills && job.skills.length > 0 && (
                <div className="clay-card p-6 sm:p-8">
                  <h2 className="text-lg font-black text-[#25243A] mb-4">Target Skills & Qualifications</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="primary" className="py-1 px-3 text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              {/* Job Overview Card */}
              <div className="clay-card p-6 space-y-4">
                <h3 className="font-black text-[#25243A] text-base pb-3 border-b border-[#E6E8F2]">
                  Position Snapshot
                </h3>

                <div className="space-y-3.5 text-xs sm:text-sm">
                  <div>
                    <span className="text-[#7E7C9A] font-bold block text-xs mb-0.5">Location & Country</span>
                    <span className="font-black text-[#25243A] flex items-center gap-1.5">
                      <span>{countryFlag}</span>
                      <span>{countryDisplayName}</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[#7E7C9A] font-bold block text-xs mb-0.5">Work Mode</span>
                    <span className="font-black text-[#25243A] capitalize">{job.workMode}</span>
                  </div>

                  <div>
                    <span className="text-[#7E7C9A] font-bold block text-xs mb-0.5">Employment Type</span>
                    <span className="font-black text-[#25243A] capitalize">{job.employmentType.replace('-', ' ')}</span>
                  </div>

                  <div>
                    <span className="text-[#7E7C9A] font-bold block text-xs mb-0.5">Experience Level</span>
                    <span className="font-black text-[#25243A] capitalize">{job.experienceLevel} Level</span>
                  </div>

                  <div>
                    <span className="text-[#7E7C9A] font-bold block text-xs mb-0.5">Source</span>
                    <span className="font-black text-[#25243A]">{isExternal ? 'External Aggregator (Adzuna)' : 'Workmark Direct'}</span>
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
          <p className="text-sm font-medium text-[#7E7C9A]">
            You're submitting your Workmark profile for <strong className="text-[#25243A]">{job.title}</strong> at <strong className="text-[#25243A]">{companyName}</strong>.
          </p>

          <Textarea
            label="Cover Letter / Note (Optional)"
            placeholder="Highlight your key achievements and why you're interested in this role..."
            rows={5}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleApply} loading={isApplying}>
              Submit Application
            </Button>
          </div>
        </div>
      </Modal>
    </PublicLayout>
  );
};
