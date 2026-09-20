import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'sky' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', size = 'sm', className }) => {
  const variantStyles = {
    default: 'bg-slate-800/80 text-slate-300 border border-slate-700/60',
    primary: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold shadow-xs',
    purple: 'bg-purple-500/15 text-purple-300 border border-purple-500/30',
    sky: 'bg-sky-500/15 text-sky-300 border border-sky-500/30',
    success: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    error: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
    info: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
    neutral: 'bg-slate-800/60 text-slate-400 border border-slate-700/40',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs font-bold rounded-xl',
    md: 'px-3.5 py-1 text-xs sm:text-sm font-bold rounded-xl',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 transition-all duration-150 select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
