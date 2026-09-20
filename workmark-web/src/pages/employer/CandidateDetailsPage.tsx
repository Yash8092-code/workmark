import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  FileText,
  ExternalLink,
  Calendar,
  Video,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  AlertCircle,
  Award,
  Globe,
} from 'lucide-react';
import { useApplication, useUpdateApplicationStatus } from '../../hooks/useApplications';
import type { ApplicationStatus } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { Avatar } from '../../components/ui/Avatar';
import { format } from 'date-fns';

const statusDisplayMap: Record<
  ApplicationStatus,
  { label: string; variant: 'warning' | 'info' | 'purple' | 'sky' | 'success' | 'neutral' }
> = {
  pending: { label: 'Applied', variant: 'warning' },
  applied: { label: 'Applied', variant: 'warning' },
  reviewed: { label: 'Reviewed', variant: 'info' },
  under_review: { label: 'Reviewed', variant: 'info' },
  shortlisted: { label: 'Shortlisted', variant: 'purple' },
  interview: { label: 'Interview Scheduled', variant: 'sky' },
  accepted: { label: 'Hired / Accepted', variant: 'success' },
  selected: { label: 'Hired / Accepted', variant: 'success' },
  rejected: { label: 'Declined', variant: 'neutral' },
};

export default function CandidateDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useApplication(id);
  const updateStatusMutation = useUpdateApplicationStatus();

  // Interview Modal State
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [interviewMode, setInterviewMode] = useState<'video' | 'phone' | 'onsite'>('video');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewLink, setInterviewLink] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [isRescheduling, setIsRescheduling] = useState(false);

  // Reject Confirmation Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Cancel Interview Modal State
  const [cancelInterviewModalOpen, setCancelInterviewModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080C15] flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-xs sm:text-sm font-bold text-slate-400">Loading Candidate Dossier...</p>
      </div>
    );
  }

  if (isError || !data || !data.application) {
    return (
      <div className="min-h-screen bg-[#080C15] flex flex-col items-center justify-center p-4">
        <div className="bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl rounded-2xl p-8 text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-[#FF6B81] mx-auto mb-3" />
          <h2 className="text-lg font-black text-white mb-1">Candidate Profile Not Found</h2>
          <p className="text-xs text-slate-400 mb-6">
            This application may have been removed or you do not have authorization to view candidate private information.
          </p>
          <Button onClick={() => navigate('/employer/dashboard')} variant="primary">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const { application, profile: apiProfile, matchScore } = data;
  const profile = (typeof application.profileId === 'object' ? application.profileId : apiProfile) as any;
  const currentStatus = application.status as ApplicationStatus;
  const statusBadge = statusDisplayMap[currentStatus] || statusDisplayMap.pending;

  const candidatePhone = profile?.phone || application.seekerProfile?.phone;
  const candidateAvatar = application.userId?.avatar || profile?.avatar;
  const candidateBio = profile?.bio || profile?.summary;
  const candidateSkills: string[] = profile?.skills || application.seekerProfile?.skills || [];
  const candidateResume = application.resume || profile?.resume || application.resumeUrl;

  const openScheduleModal = (reschedule = false) => {
    setIsRescheduling(reschedule);
    if (reschedule && application.interview?.scheduledAt) {
      const d = new Date(application.interview.scheduledAt);
      setInterviewDate(d.toISOString().split('T')[0]);
      setInterviewTime(d.toTimeString().substring(0, 5));
      setInterviewMode(application.interview.mode || 'video');
      setInterviewLink(application.interview.link || application.interview.locationOrLink || '');
      setInterviewNotes(application.interview.notes || application.interview.message || '');
    } else {
      setInterviewDate('');
      setInterviewTime('');
      setInterviewMode('video');
      setInterviewLink('');
      setInterviewNotes('');
    }
    setInterviewModalOpen(true);
  };

  const handleSaveInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewDate || !interviewTime) return;

    await updateStatusMutation.mutateAsync({
      id: application._id,
      payload: {
        status: 'interview',
        interviewAction: isRescheduling ? 'reschedule' : 'schedule',
        interviewDate,
        interviewTime,
        interviewMode,
        interviewLocation: interviewLink,
        interviewMessage: interviewNotes,
      },
    });

    setInterviewModalOpen(false);
  };

  const handleCancelInterview = async () => {
    await updateStatusMutation.mutateAsync({
      id: application._id,
      payload: {
        status: 'shortlisted',
        interviewAction: 'cancel',
        cancelledReason: 'Interview was cancelled by employer.',
        note: 'Interview cancelled, candidate returned to Shortlist.',
      },
    });
    setCancelInterviewModalOpen(false);
  };

  const handleConfirmReject = async () => {
    await updateStatusMutation.mutateAsync({
      id: application._id,
      status: 'rejected',
      note: rejectReason.trim() || undefined,
    });
    setRejectModalOpen(false);
    setRejectReason('');
  };

  const handleTransition = (nextStatus: ApplicationStatus) => {
    updateStatusMutation.mutate({
      id: application._id,
      status: nextStatus,
    });
  };

  return (
    <div className="min-h-screen bg-[#080C15] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Candidates</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Application ID:</span>
            <span className="text-xs font-mono bg-cyan-500/10 text-cyan-400 px-2.5 py-0.5 rounded-lg font-bold border border-cyan-500/20">
              {application._id}
            </span>
          </div>
        </div>

        {/* Candidate Dossier Header Banner */}
        <div className="bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
            <div className="flex items-start gap-4">
              <Avatar
                src={candidateAvatar}
                name={application.userId?.name || 'Applicant'}
                size="xl"
                shape="rounded"
              />

              <div>
                <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {application.userId?.name || 'Applicant'}
                  </h1>
                  <Badge variant={statusBadge.variant} size="md">
                    {statusBadge.label}
                  </Badge>
                  {matchScore !== undefined && matchScore > 0 && (
                    <Badge variant="success" size="md" className="gap-1">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{matchScore}% Match</span>
                    </Badge>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-bold text-cyan-400 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  <span>Applied for: <strong>{application.jobId?.title || 'Job Listing'}</strong></span>
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Applied on {format(new Date(application.createdAt || application.appliedAt || Date.now()), 'MMMM dd, yyyy • h:mm a')}
                </p>
              </div>
            </div>

            {/* Quick Contact Action Bar */}
            <div className="flex flex-wrap items-center gap-3">
              {application.userId?.email && (
                <a href={`mailto:${application.userId.email}?subject=Regarding your application for ${application.jobId?.title || 'the position'}`}>
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-1.5 text-[#6C5CE7]" />
                    <span>Email Candidate</span>
                  </Button>
                </a>
              )}

              {candidatePhone && (
                <a href={`tel:${candidatePhone}`}>
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4 mr-1.5 text-[#35C98A]" />
                    <span>Call Candidate</span>
                  </Button>
                </a>
              )}

              {candidateResume && (
                <a href={candidateResume} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="primary">
                    <FileText className="w-4 h-4 mr-1.5" />
                    <span>Download CV / Resume</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Recruitment Action Workflow Toolbar */}
          <div className="pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                Recruitment Workflow Transition
              </span>
              <p className="text-xs text-slate-400">
                Advance candidate through verified stages or schedule interviews
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Stage: PENDING → can mark reviewed or reject */}
              {currentStatus === 'pending' && (
                <Button
                  onClick={() => handleTransition('reviewed')}
                  disabled={updateStatusMutation.isPending}
                  variant="soft"
                  size="sm"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Mark Reviewed
                </Button>
              )}

              {/* Stage: REVIEWED → can shortlist or reject */}
              {currentStatus === 'reviewed' && (
                <Button
                  onClick={() => handleTransition('shortlisted')}
                  disabled={updateStatusMutation.isPending}
                  variant="primary"
                  size="sm"
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Shortlist Candidate
                </Button>
              )}

              {/* Stage: SHORTLISTED → can schedule interview, make offer, or reject */}
              {currentStatus === 'shortlisted' && (
                <Button
                  onClick={() => openScheduleModal(false)}
                  disabled={updateStatusMutation.isPending}
                  variant="secondary"
                  size="sm"
                >
                  <Calendar className="w-4 h-4 mr-1.5 text-[#6C5CE7]" />
                  Schedule Interview
                </Button>
              )}

              {/* Stage: INTERVIEW → can reschedule, cancel, make offer, or reject */}
              {currentStatus === 'interview' && (
                <>
                  <Button
                    onClick={() => openScheduleModal(true)}
                    disabled={updateStatusMutation.isPending}
                    variant="primary"
                    size="sm"
                  >
                    <Calendar className="w-4 h-4 mr-1.5" />
                    Reschedule Interview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCancelInterviewModalOpen(true)}
                    disabled={updateStatusMutation.isPending}
                    className="text-[#FFB84D] hover:bg-[#FFF7EB] hover:border-[#FFB84D]"
                  >
                    <XCircle className="w-4 h-4 mr-1.5" />
                    Cancel Interview
                  </Button>
                </>
              )}

              {/* Make Offer / Hire — only from shortlisted or interview stages (valid transitions) */}
              {(currentStatus === 'shortlisted' || currentStatus === 'interview') && (
                <Button
                  onClick={() => handleTransition('accepted')}
                  disabled={updateStatusMutation.isPending}
                  variant="success"
                  size="sm"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Make Offer / Hire
                </Button>
              )}

              {/* Decline — available at any non-terminal stage */}
              {currentStatus !== 'accepted' && currentStatus !== 'rejected' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRejectModalOpen(true)}
                  disabled={updateStatusMutation.isPending}
                  className="text-[#FF6B81] hover:bg-[#FFEBF0] hover:border-[#FF6B81]"
                >
                  <XCircle className="w-4 h-4 mr-1.5" />
                  Decline Candidate
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Scheduled Interview Callout Card if Active */}
        {application.interview?.scheduledAt && (
          <div className="clay-card-dark p-6 sm:p-7 shadow-md mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 text-white rounded-2xl border border-white/20">
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white">Interview Details</h3>
                    <Badge variant="sky">
                      {application.interview.status?.toUpperCase() || 'SCHEDULED'}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Format: <strong className="capitalize text-white">{application.interview.mode || 'video'} interview</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openScheduleModal(true)}
                  className="bg-white/15 text-white border-white/25 hover:bg-white/25 hover:text-white"
                >
                  Reschedule
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <span className="text-slate-300 block mb-1">Date & Time</span>
                <span className="font-bold text-sm text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#8ED8FF]" />
                  {format(new Date(application.interview.scheduledAt), 'EEEE, MMMM d, yyyy • h:mm a')}
                </span>
              </div>

              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <span className="text-slate-300 block mb-1">Meeting Link / Location</span>
                {application.interview.link || application.interview.locationOrLink ? (
                  <a
                    href={application.interview.link || application.interview.locationOrLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-sm text-[#8ED8FF] hover:underline flex items-center gap-1 truncate"
                  >
                    <span>{application.interview.link || application.interview.locationOrLink}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                ) : (
                  <span className="text-slate-300 font-medium">To be provided / Onsite</span>
                )}
              </div>

              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <span className="text-slate-300 block mb-1">Preparation Notes</span>
                <span className="text-slate-200 line-clamp-2">
                  {application.interview.notes || application.interview.message || 'No special instructions specified.'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Candidate Profile Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Cover Letter */}
            {application.coverLetter && (
              <Card variant="raised" className="p-6 sm:p-7">
                <h2 className="text-base font-black text-white mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Cover Letter / Note from Applicant</span>
                </h2>
                <div className="clay-card-inset p-4 rounded-2xl text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {application.coverLetter}
                </div>
              </Card>
            )}

            {/* Candidate Bio / Summary */}
            {candidateBio && (
              <Card variant="raised" className="p-6 sm:p-7">
                <h2 className="text-base font-black text-white mb-3">Professional Summary</h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {candidateBio}
                </p>
              </Card>
            )}

            {/* Work Experience */}
            {profile?.experience && profile.experience.length > 0 && (
              <Card variant="raised" className="p-6 sm:p-7">
                <h2 className="text-base font-black text-white mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-cyan-400" />
                  <span>Work Experience</span>
                </h2>
                <div className="space-y-3.5">
                  {profile.experience.map((exp: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08]"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <h3 className="font-black text-sm text-white">{exp.title}</h3>
                        <span className="text-[11px] font-bold text-slate-400">
                          {exp.startDate ? format(new Date(exp.startDate), 'MMM yyyy') : ''} —{' '}
                          {exp.current ? 'Present' : exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : ''}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-cyan-400 mb-2">{exp.company}</p>
                      {exp.description && (
                        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Education */}
            {profile?.education && profile.education.length > 0 && (
              <Card variant="raised" className="p-6 sm:p-7">
                <h2 className="text-base font-black text-white mb-4 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  <span>Education</span>
                </h2>
                <div className="space-y-3.5">
                  {profile.education.map((edu: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08]"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <h3 className="font-black text-sm text-white">{edu.degree}</h3>
                        <span className="text-[11px] font-bold text-slate-400">
                          {edu.startDate ? format(new Date(edu.startDate), 'yyyy') : ''} —{' '}
                          {edu.current ? 'Present' : edu.endDate ? format(new Date(edu.endDate), 'yyyy') : ''}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-cyan-400">{edu.institution}</p>
                      {edu.fieldOfStudy && (
                        <p className="text-xs text-slate-300 mt-0.5">{edu.fieldOfStudy}</p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Skills Card */}
            <Card variant="raised" className="p-6">
              <h2 className="text-base font-black text-white mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />
                <span>Skills & Expertise</span>
              </h2>
              {candidateSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {candidateSkills.map((skill, idx) => (
                    <Badge key={idx} variant="purple">
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No specific skills listed.</p>
              )}
            </Card>

            {/* Social / Portfolio Links */}
            {(profile?.socialLinks || profile?.website || profile?.github || profile?.linkedin) && (
              <Card variant="raised" className="p-6 space-y-3">
                <h2 className="text-base font-black text-white mb-3">Portfolio & Profiles</h2>
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-bold text-[#6C5CE7] hover:underline"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Portfolio Website</span>
                  </a>
                )}
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-bold text-[#25243A] hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>GitHub Profile</span>
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-bold text-[#0284C7] hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>LinkedIn Profile</span>
                  </a>
                )}
              </Card>
            )}

            {/* Stage Progression Timeline */}
            <Card variant="raised" className="p-6">
              <h2 className="text-base font-black text-white mb-4">Application History</h2>
              <div className="space-y-3 text-xs">
                {application.statusHistory && application.statusHistory.length > 0 ? (
                  application.statusHistory.map((history: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5 pb-2.5 border-b border-white/10 last:border-0">
                      <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 mt-1 shrink-0" />
                      <div>
                        <span className="font-black text-white capitalize">
                          Status changed to {history.status}
                        </span>
                        <span className="block text-[11px] text-slate-400">
                          {format(new Date(history.changedAt), 'MMM dd, yyyy • h:mm a')}
                        </span>
                        {history.note && (
                          <p className="text-[11px] text-slate-400 italic mt-0.5">"{history.note}"</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-start gap-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 mt-1 shrink-0" />
                    <div>
                      <span className="font-black text-white">Applied</span>
                      <span className="block text-[11px] text-slate-400">
                        {format(new Date(application.createdAt || application.appliedAt || Date.now()), 'MMM dd, yyyy • h:mm a')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Interview Scheduling / Rescheduling Modal */}
      <Modal
        isOpen={interviewModalOpen}
        onClose={() => setInterviewModalOpen(false)}
        title={isRescheduling ? 'Reschedule Interview' : 'Schedule Candidate Interview'}
        size="md"
      >
        <form onSubmit={handleSaveInterview} className="space-y-4">
          <p className="text-xs text-slate-400">
            Configure the interview meeting parameters. The applicant will receive an immediate notification with full details.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">Interview Date *</label>
              <input
                type="date"
                required
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="genz-input-surface w-full px-3.5 py-2.5 text-xs text-slate-100 bg-[#0B0F19] border border-white/12 focus:border-cyan-400 focus:outline-none rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">Time *</label>
              <input
                type="time"
                required
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
                className="genz-input-surface w-full px-3.5 py-2.5 text-xs text-slate-100 bg-[#0B0F19] border border-white/12 focus:border-cyan-400 focus:outline-none rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">Interview Format</label>
            <div className="grid grid-cols-3 gap-2">
              {(['video', 'phone', 'onsite'] as const).map((mode) => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => setInterviewMode(mode)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    interviewMode === mode
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              {interviewMode === 'video'
                ? 'Meeting URL (Google Meet / Zoom)'
                : interviewMode === 'phone'
                ? 'Phone Number / Bridge'
                : 'Office Location / Address'}
            </label>
            <input
              type="text"
              placeholder={
                interviewMode === 'video'
                  ? 'https://meet.google.com/...'
                  : interviewMode === 'phone'
                  ? '+1 555-0199'
                  : '123 Tech Boulevard, Floor 4'
              }
              value={interviewLink}
              onChange={(e) => setInterviewLink(e.target.value)}
              className="genz-input-surface w-full px-3.5 py-2.5 text-xs text-slate-100 bg-[#0B0F19] border border-white/12 focus:border-cyan-400 focus:outline-none rounded-xl placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">Preparation Instructions</label>
            <textarea
              rows={3}
              placeholder="e.g. Please be prepared to review your portfolio and discuss system design."
              value={interviewNotes}
              onChange={(e) => setInterviewNotes(e.target.value)}
              className="genz-input-surface w-full px-3.5 py-2.5 text-xs text-slate-100 bg-[#0B0F19] border border-white/12 focus:border-cyan-400 focus:outline-none rounded-xl placeholder-slate-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setInterviewModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateStatusMutation.isPending || !interviewDate || !interviewTime}
              loading={updateStatusMutation.isPending}
              variant="primary"
            >
              {isRescheduling ? 'Confirm Reschedule' : 'Schedule & Notify Candidate'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Cancel Interview Modal */}
      <Modal
        isOpen={cancelInterviewModalOpen}
        onClose={() => setCancelInterviewModalOpen(false)}
        title="Cancel Scheduled Interview"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Are you sure you want to cancel the scheduled interview with <strong className="text-white">{application.userId?.name}</strong>? The candidate will be notified and their application status will revert to <strong className="text-cyan-400">Shortlisted</strong>.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setCancelInterviewModalOpen(false)}
            >
              Keep Interview
            </Button>
            <Button
              onClick={handleCancelInterview}
              disabled={updateStatusMutation.isPending}
              loading={updateStatusMutation.isPending}
              variant="danger"
            >
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Candidate Confirmation Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Decline Candidate"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Are you sure you want to decline <strong className="text-white">{application.userId?.name}</strong> for <strong className="text-cyan-400">{application.jobId?.title}</strong>?
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">Feedback / Internal Note (Optional)</label>
            <textarea
              rows={2}
              placeholder="e.g. Profile does not meet minimum technical experience requirements."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="genz-input-surface w-full px-3.5 py-2.5 text-xs text-slate-100 bg-[#0B0F19] border border-white/12 focus:border-cyan-400 focus:outline-none rounded-xl placeholder-slate-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setRejectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmReject}
              disabled={updateStatusMutation.isPending}
              loading={updateStatusMutation.isPending}
              variant="danger"
            >
              Confirm Decline
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
