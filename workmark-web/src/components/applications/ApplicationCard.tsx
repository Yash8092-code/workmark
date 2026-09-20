import React from 'react';
import { Link } from 'react-router-dom';
import type { Application } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatDistanceToNow, format } from 'date-fns';
import {
  Building2,
  Calendar,
  CheckCircle,
  AlertCircle,
  Video,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { getCountryDisplayName, getCountryFlag } from '../../utils/countries';

interface ApplicationCardProps {
  application: Application;
  isHighlighted?: boolean;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, isHighlighted = false }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
      case 'applied':
        return <Badge variant="warning">Applied</Badge>;
      case 'reviewed':
      case 'under_review':
        return <Badge variant="primary">Under Review</Badge>;
      case 'shortlisted':
        return <Badge variant="primary">Shortlisted</Badge>;
      case 'interview':
        return <Badge variant="primary">Interview Stage</Badge>;
      case 'accepted':
      case 'selected':
        return <Badge variant="success">Accepted / Offer</Badge>;
      case 'rejected':
        return <Badge variant="error">Not Selected</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const jobData = typeof application.jobId === 'object' ? application.jobId : null;
  const companyData = jobData?.companyId && typeof jobData.companyId === 'object' ? jobData.companyId : null;
  const companyName = companyData?.name || jobData?.companyName || 'Organization';
  const companyLogo = companyData?.logo || jobData?.companyLogo;

  const countryName = getCountryDisplayName(jobData?.country || jobData?.countryCode);
  const countryFlag = getCountryFlag(jobData?.country || jobData?.countryCode);

  // 5 Canonical linear steps
  const steps = [
    { key: 'pending', label: 'Applied' },
    { key: 'reviewed', label: 'Review' },
    { key: 'shortlisted', label: 'Shortlist' },
    { key: 'interview', label: 'Interview' },
    { key: 'accepted', label: 'Offer' },
  ];

  const getStepIndex = (status: string) => {
    if (status === 'pending' || status === 'applied') return 0;
    if (status === 'reviewed' || status === 'under_review') return 1;
    if (status === 'shortlisted') return 2;
    if (status === 'interview') return 3;
    if (status === 'accepted' || status === 'selected') return 4;
    return -1;
  };

  const currentStepIdx = getStepIndex(application.status);
  const isRejected = application.status === 'rejected';
  const isInterview = application.status === 'interview';
  const interviewData = application.interview;

  return (
    <div
      id={`application-${application._id}`}
      className={`clay-card p-6 transition-all ${
        isHighlighted
          ? 'ring-4 ring-[#6C5CE7]/30 border-[#6C5CE7]'
          : 'hover:scale-[1.005]'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
        <div className="flex items-start gap-4">
          {companyLogo ? (
            <img
              src={companyLogo}
              alt={companyName}
              className="h-14 w-14 rounded-2xl object-contain border border-[#E6E8F2] bg-white p-1.5 shadow-sm flex-shrink-0"
            />
          ) : (
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#6C5CE7] to-[#5146C7] text-white font-black flex items-center justify-center text-lg shadow-sm flex-shrink-0">
              {companyName.substring(0, 2).toUpperCase() || <Building2 className="h-6 w-6" />}
            </div>
          )}

          <div>
            <h3 className="text-lg font-black text-white tracking-tight mb-0.5">
              {jobData?.title || 'Position'}
            </h3>
            <p className="text-sm font-bold text-cyan-400 mb-2">{companyName}</p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1 text-slate-200">
                <span>{countryFlag}</span>
                <span>{countryName}</span>
                {jobData?.location && jobData.location !== countryName && (
                  <span className="text-slate-400">· {jobData.location}</span>
                )}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                <span>
                  Applied {formatDistanceToNow(new Date(application.appliedAt || application.createdAt), { addSuffix: true })}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="self-start">
          {getStatusBadge(application.status)}
        </div>
      </div>

      {/* Visual Step Progress Tracker */}
      {!isRejected ? (
        <div className="py-3 px-4 bg-slate-900/70 rounded-2xl border border-white/10 mb-4">
          <div className="grid grid-cols-5 gap-2 relative">
            {steps.map((step, idx) => {
              const isCompleted = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <div key={step.key} className="flex flex-col items-center text-center">
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-black mb-1.5 transition-all ${
                      isCurrent
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md ring-4 ring-cyan-500/25'
                        : isCompleted
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-slate-800 text-slate-400 border border-white/10'
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="h-4 w-4" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[11px] font-bold tracking-tight ${
                      isCurrent
                        ? 'text-cyan-400'
                        : isCompleted
                        ? 'text-slate-200'
                        : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="py-3 px-4 bg-rose-500/15 rounded-2xl border border-rose-500/30 mb-4 flex items-center gap-2 text-xs font-bold text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>Application was reviewed and not moved forward for this specific role.</span>
        </div>
      )}

      {/* Active Interview Callout Banner */}
      {isInterview && interviewData && interviewData.status !== 'cancelled' && (
        <div
          className="surface-light p-4.5 bg-gradient-to-r from-[#EDE9FE] via-[#E0F2FE] to-[#EDE9FE] rounded-2xl border border-[#DDD6FE] mb-4 space-y-2.5 shadow-sm"
          data-surface="light"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#4338CA]">
              <Sparkles className="h-3.5 w-3.5 text-[#4338CA]" />
              <span>Interview Scheduled</span>
            </span>
            {interviewData.status === 'rescheduled' && (
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                Rescheduled
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs text-[#0F172A]">
            {(interviewData.scheduledAt || interviewData.date) && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#4338CA] shrink-0" />
                <span>
                  <strong className="text-[#334155]">Date & Time:</strong>{' '}
                  <span className="font-bold text-[#0F172A]">
                    {interviewData.scheduledAt
                      ? format(new Date(interviewData.scheduledAt), 'EEEE, MMMM d, yyyy • h:mm a')
                      : `${interviewData.date} ${interviewData.time ? `at ${interviewData.time}` : ''}`}
                  </span>
                </span>
              </div>
            )}
            {interviewData.mode && (
              <div className="flex items-center gap-2">
                {interviewData.mode === 'video' ? (
                  <Video className="h-4 w-4 text-[#4338CA] shrink-0" />
                ) : interviewData.mode === 'phone' ? (
                  <Phone className="h-4 w-4 text-[#4338CA] shrink-0" />
                ) : (
                  <MapPin className="h-4 w-4 text-[#4338CA] shrink-0" />
                )}
                <span>
                  <strong className="text-[#334155]">Format:</strong>{' '}
                  <span className="capitalize font-bold text-[#0F172A]">
                    {interviewData.mode} Interview
                  </span>
                </span>
              </div>
            )}
          </div>

          {(interviewData.link || interviewData.locationOrLink) && (
            <div className="pt-1 text-xs">
              <span className="font-bold text-[#475569] block mb-1">Meeting Link / Address:</span>
              {(interviewData.link || interviewData.locationOrLink)?.startsWith('http') ? (
                <a
                  href={interviewData.link || interviewData.locationOrLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-black text-[#4338CA] hover:text-[#312E81] hover:underline"
                >
                  <span className="truncate max-w-sm sm:max-w-md">{interviewData.link || interviewData.locationOrLink}</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>
              ) : (
                <span className="font-bold text-[#0F172A]">{interviewData.link || interviewData.locationOrLink}</span>
              )}
            </div>
          )}

          {(interviewData.notes || interviewData.message) && (
            <p className="text-xs text-[#0F172A] bg-white/95 p-3 rounded-xl border border-[#CBD5E1] mt-2 font-medium shadow-xs">
              <strong className="text-[#334155]">Instructions:</strong> {interviewData.notes || interviewData.message}
            </p>
          )}
        </div>
      )}

      {/* Timeline Dates */}
      <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold text-slate-400 mb-3">
        {application.appliedAt && (
          <span>Applied: {format(new Date(application.appliedAt), 'MMM dd, yyyy')}</span>
        )}
        {application.reviewedAt && (
          <span>Reviewed: {format(new Date(application.reviewedAt), 'MMM dd, yyyy')}</span>
        )}
        {application.interviewAt && (
          <span>Interview: {format(new Date(application.interviewAt), 'MMM dd, yyyy')}</span>
        )}
        {application.acceptedAt && (
          <span className="text-[#059669] font-bold">
            Accepted: {format(new Date(application.acceptedAt), 'MMM dd, yyyy')}
          </span>
        )}
      </div>

      {/* Footer Action */}
      <div className="flex items-center justify-between pt-3 border-t border-[#E6E8F2] text-xs font-semibold text-[#7E7C9A]">
        <span>Direct recruitment pipeline status</span>
        {jobData?._id && (
          <Link to={`/jobs/${jobData._id}`}>
            <Button variant="ghost" size="sm" className="font-bold text-[#6C5CE7] hover:bg-[#EDE9FE]/50">
              View Role Details →
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
