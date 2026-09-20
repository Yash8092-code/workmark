import React from 'react';
import { Modal } from '../ui/Modal';
import type { OpportunityExplanation, MatchTier, OpportunityTag, MatchConfidence } from '../../types';
import {
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  DollarSign,
  Compass,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface OpportunityBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  companyName: string;
  intel?: OpportunityExplanation;
  onApply?: () => void;
  isExternal?: boolean;
}

export const OpportunityBreakdownModal: React.FC<OpportunityBreakdownModalProps> = ({
  isOpen,
  onClose,
  jobTitle,
  companyName,
  intel,
  onApply,
  isExternal,
}) => {
  if (!intel) return null;

  const getTierBadge = (tier: MatchTier) => {
    switch (tier) {
      case 'Strong Match':
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">Strong Match</span>;
      case 'Good Match':
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]">Good Match</span>;
      case 'Worth Exploring':
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]">Worth Exploring</span>;
      case 'Low Match':
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-[#F7F7FB] text-[#7E7C9A] border border-[#E6E8F2]">Low Match</span>;
    }
  };

  const getTagBadge = (tag: OpportunityTag) => {
    switch (tag) {
      case 'Skill Stretch':
        return (
          <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-[#EDE9FE] text-[#6C5CE7] border border-[#DDD6FE]">
            <TrendingUp className="h-3 w-3" />
            Skill Stretch
          </span>
        );
      case 'Remote':
        return (
          <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
            Remote
          </span>
        );
      case 'Global':
        return (
          <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]">
            Global
          </span>
        );
      case 'Fresh':
        return (
          <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5]">
            ⚡ Fresh
          </span>
        );
    }
  };

  const getConfidenceBadge = (confidence: MatchConfidence) => {
    switch (confidence) {
      case 'High confidence':
        return <span className="text-[11px] font-bold text-[#059669] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">High Confidence</span>;
      case 'Moderate confidence':
        return <span className="text-[11px] font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full border border-[#DBEAFE]">Moderate Confidence</span>;
      case 'Limited data':
      default:
        return <span className="text-[11px] font-bold text-[#7E7C9A] bg-[#F7F7FB] px-2.5 py-0.5 rounded-full border border-[#E6E8F2]">Limited Data</span>;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Opportunity Intelligence Assessment" size="lg">
      <div className="space-y-6">
        {/* Header Summary */}
        <div className="clay-card-dark p-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8ED8FF]">
                {companyName}
              </span>
              <h3 className="text-lg sm:text-xl font-black tracking-tight mt-0.5 text-white">
                {jobTitle}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {getTierBadge(intel.matchTier)}
                {intel.tags.map(getTagBadge)}
                {getConfidenceBadge(intel.matchConfidence)}
              </div>
            </div>

            <div className="flex sm:flex-col items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 shrink-0 text-center">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center">
                {intel.score}
                <span className="text-lg text-[#8ED8FF] font-black ml-0.5">%</span>
              </span>
              <span className="text-[11px] uppercase tracking-wider font-bold text-white/80 sm:mt-1">
                Match Score
              </span>
            </div>
          </div>
        </div>

        {/* Application Guidance Banner */}
        <div
          data-surface="light"
          className={`surface-light p-4 rounded-2xl border ${
            intel.applicationGuidance.status === 'recommended'
              ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
              : intel.applicationGuidance.status === 'skill_stretch'
              ? 'bg-[#EDE9FE] border-[#DDD6FE] text-[#5146C7]'
              : 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-white shadow-xs shrink-0 mt-0.5">
              <ShieldCheck className="h-5 w-5 text-current" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#0F172A]">{intel.applicationGuidance.headline}</h4>
              <p className="text-xs font-semibold text-[#334155] mt-1 leading-relaxed">
                {intel.applicationGuidance.summary}
              </p>
            </div>
          </div>
        </div>

        {/* Fit Signals & Evidence */}
        {intel.fitSignals.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Why This Opportunity Fits</span>
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {intel.fitSignals.map((signal, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-bold text-slate-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{signal}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Overlap & Gaps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Matched Skills */}
          <div data-surface="light" className="surface-light p-4 rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5]/90">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-[#065F46]">Matching Skills</span>
              <span className="text-xs font-black text-[#059669] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full border border-[#A7F3D0]">
                {intel.matchingSkills.length} Verified
              </span>
            </div>
            {intel.matchingSkills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {intel.matchingSkills.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white text-[#065F46] border border-[#A7F3D0] shadow-xs">
                    ✓ {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#065F46]/70 italic">No exact skill matches detected in profile.</p>
            )}
          </div>

          {/* Missing / Growth Skills */}
          <div data-surface="light" className="surface-light p-4 rounded-2xl border border-[#DDD6FE] bg-[#EDE9FE]/90">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-[#5146C7]">Target Growth Skills</span>
              <span className="text-xs font-black text-[#6C5CE7] bg-[#EDE9FE] px-2.5 py-0.5 rounded-full border border-[#DDD6FE]">
                {intel.missingSkills.length} Requested
              </span>
            </div>
            {intel.missingSkills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {intel.missingSkills.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white text-[#5146C7] border border-[#DDD6FE] shadow-xs">
                    + {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#5146C7]/70 italic">You possess all key requirements identified for this opening.</p>
            )}
          </div>
        </div>

        {/* Compensation Transparency */}
        <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.04]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-black text-slate-200">Compensation Transparency</span>
            </div>
            <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
              intel.salaryFit.status === 'compatible'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-white/10 text-slate-300 border border-white/10'
            }`}>
              {intel.salaryFit.label}
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {onApply && (
            <Button
              variant="primary"
              onClick={() => {
                onClose();
                onApply();
              }}
            >
              <Compass className="h-4 w-4 mr-1.5" />
              <span>{isExternal ? 'Apply on Source Site' : 'Apply for this Role'}</span>
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
