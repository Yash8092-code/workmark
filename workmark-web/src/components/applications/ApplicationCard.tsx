import React from 'react';
import { Link } from 'react-router-dom';
import type { Application } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatDistanceToNow } from 'date-fns';
import { Building2, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { getCountryDisplayName, getCountryFlag } from '../../utils/countries';

interface ApplicationCardProps {
  application: Application;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {
  const getStatusVariant = (status: string) => {
    const variants: { [key: string]: 'default' | 'info' | 'warning' | 'success' | 'error' } = {
      applied: 'default',
      under_review: 'info',
      shortlisted: 'warning',
      interview: 'warning',
      selected: 'success',
      rejected: 'error',
    };
    return variants[status] || 'default';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      applied: 'Application Submitted',
      under_review: 'Under Review',
      shortlisted: 'Shortlisted',
      interview: 'Interview Stage',
      selected: 'Offer Extended',
      rejected: 'Not Selected',
    };
    return labels[status] || status;
  };

  const jobData = typeof application.jobId === 'object' ? application.jobId : null;
  const companyData = jobData?.companyId && typeof jobData.companyId === 'object' ? jobData.companyId : null;
  const companyName = companyData?.name || jobData?.companyName || 'Organization';
  const companyLogo = companyData?.logo || jobData?.companyLogo;

  const countryName = getCountryDisplayName(jobData?.country || jobData?.countryCode);
  const countryFlag = getCountryFlag(jobData?.country || jobData?.countryCode);

  // Define standard linear steps
  const steps = [
    { key: 'applied', label: 'Submitted' },
    { key: 'under_review', label: 'Review' },
    { key: 'interview', label: 'Interview' },
    { key: 'selected', label: 'Offer' },
  ];

  const getStepIndex = (status: string) => {
    if (status === 'applied') return 0;
    if (status === 'under_review') return 1;
    if (status === 'shortlisted' || status === 'interview') return 2;
    if (status === 'selected') return 3;
    return -1;
  };

  const currentStepIdx = getStepIndex(application.status);
  const isRejected = application.status === 'rejected';

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-xs hover:border-[#CBD5E1] transition-all">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
        <div className="flex items-start gap-4">
          {companyLogo ? (
            <img
              src={companyLogo}
              alt={companyName}
              className="h-14 w-14 rounded-2xl object-contain border border-[#F1F5F9] bg-white p-1 shadow-xs flex-shrink-0"
            />
          ) : (
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white font-bold flex items-center justify-center text-base shadow-xs flex-shrink-0">
              {companyName.substring(0, 2).toUpperCase() || <Building2 className="h-6 w-6" />}
            </div>
          )}

          <div>
            <h3 className="text-lg font-bold text-[#0F172A] tracking-tight mb-1">
              {jobData?.title || 'Position'}
            </h3>
            <p className="text-sm font-semibold text-[#64748B] mb-2">{companyName}</p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B]">
              <span className="flex items-center gap-1 font-medium text-[#0F172A]">
                <span>{countryFlag}</span>
                <span>{countryName}</span>
                {jobData?.location && jobData.location !== countryName && (
                  <span className="text-[#64748B]">· {jobData.location}</span>
                )}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>Applied {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="self-start">
          <Badge variant={getStatusVariant(application.status)}>
            {getStatusLabel(application.status)}
          </Badge>
        </div>
      </div>

      {/* Visual Application Progress Pipeline */}
      {!isRejected ? (
        <div className="py-3 px-4 bg-[#F8FAFC] rounded-2xl border border-[#F1F5F9] mb-4">
          <div className="grid grid-cols-4 gap-2 relative">
            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <div key={step.key} className="flex flex-col items-center text-center">
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-1.5 transition-colors ${
                      isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#E2E8F0] text-[#64748B]'
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="h-3.5 w-3.5" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[11px] font-semibold tracking-tight ${
                      isCurrent
                        ? 'text-blue-600 font-bold'
                        : isCompleted
                        ? 'text-[#0F172A]'
                        : 'text-[#94A3B8]'
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
        <div className="py-2.5 px-4 bg-red-50/70 rounded-2xl border border-red-100 mb-4 flex items-center gap-2 text-xs font-medium text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Application was reviewed and not moved forward for this specific role.</span>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] text-xs">
        <span className="text-[#64748B] font-medium">Status updated regularly</span>
        {jobData?._id && (
          <Link to={`/jobs/${jobData._id}`}>
            <Button variant="ghost" size="sm" className="rounded-xl font-semibold text-blue-600 hover:text-blue-700">
              View Opportunity Details →
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
