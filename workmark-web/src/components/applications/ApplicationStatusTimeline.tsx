import React from 'react';
import type { Application } from '../../types';
import { Check, Clock, Eye, UserCheck, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ApplicationStatusTimelineProps {
  application: Application;
}

export const ApplicationStatusTimeline: React.FC<ApplicationStatusTimelineProps> = ({ application }) => {
  const statuses = [
    { key: 'applied', label: 'Applied', icon: Clock },
    { key: 'under_review', label: 'Under Review', icon: Eye },
    { key: 'shortlisted', label: 'Shortlisted', icon: UserCheck },
    { key: 'interview', label: 'Interview', icon: UserCheck },
    { key: 'selected', label: 'Selected', icon: Check },
  ];

  const currentStatusIndex = statuses.findIndex((s) => s.key === application.status);
  const isRejected = application.status === 'rejected';

  const getStatusHistory = (statusKey: string) => {
    return application.statusHistory.find((h) => h.status === statusKey);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#172033]">Application Status</h3>

      {isRejected ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <XCircle className="h-6 w-6 text-[#DC2626] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-[#DC2626]">Application Rejected</p>
            {application.notes && (
              <p className="text-sm text-[#64748B] mt-1">{application.notes}</p>
            )}
            <p className="text-xs text-[#64748B] mt-2">
              {formatDistanceToNow(new Date(application.updatedAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          {statuses.map((status, index) => {
            const Icon = status.icon;
            const isActive = index === currentStatusIndex;
            const isCompleted = index < currentStatusIndex;
            const statusHistory = getStatusHistory(status.key);

            return (
              <div key={status.key} className="flex items-start space-x-4 pb-8 last:pb-0">
                {/* Line */}
                {index < statuses.length - 1 && (
                  <div
                    className={`absolute left-4 top-10 w-0.5 h-[calc(100%-2.5rem)] ${
                      isCompleted ? 'bg-[#16A34A]' : 'bg-[#E2E8F0]'
                    }`}
                    style={{ marginTop: '0.5rem' }}
                  />
                )}

                {/* Icon */}
                <div
                  className={`relative z-10 flex items-center justify-center h-8 w-8 rounded-full border-2 ${
                    isCompleted
                      ? 'bg-[#16A34A] border-[#16A34A] text-white'
                      : isActive
                      ? 'bg-[#2563EB] border-[#2563EB] text-white'
                      : 'bg-white border-[#E2E8F0] text-[#64748B]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <p
                    className={`font-medium ${
                      isActive || isCompleted ? 'text-[#172033]' : 'text-[#64748B]'
                    }`}
                  >
                    {status.label}
                  </p>
                  {statusHistory && (
                    <p className="text-sm text-[#64748B] mt-1">
                      {formatDistanceToNow(new Date(statusHistory.changedAt), { addSuffix: true })}
                    </p>
                  )}
                  {statusHistory?.note && (
                    <p className="text-sm text-[#64748B] mt-1">{statusHistory.note}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
