import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="clay-card p-8 sm:p-12 flex flex-col items-center justify-center text-center my-6">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4 shadow-inner">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-black text-white mb-1.5 tracking-tight">{title}</h3>
      {description && (
        <p className="text-xs sm:text-sm text-slate-400 mb-6 max-w-md leading-relaxed">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="primary" size="md">
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
