import React from 'react';
import { cn } from '../../utils/cn';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'avatar' | 'row' | 'pill';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, variant = 'text' }) => {
  const variantStyles = {
    text: 'h-4 w-full rounded-xl',
    card: 'h-48 w-full clay-card',
    avatar: 'h-12 w-12 rounded-2xl',
    row: 'h-16 w-full rounded-2xl',
    pill: 'h-7 w-24 rounded-xl',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-gradient-to-r from-[#EDE9FE]/70 via-[#F5F3FF] to-[#EDE9FE]/70',
        variantStyles[variant],
        className
      )}
    />
  );
};

export const SkeletonText: React.FC<{ lines?: number }> = ({ lines = 3 }) => {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} variant="text" className={i === lines - 1 ? 'w-2/3' : 'w-full'} />
      ))}
    </div>
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('clay-card p-6 space-y-4 bg-white', className)}>
      <div className="flex items-center space-x-4">
        <Skeleton variant="avatar" className="h-14 w-14 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-3.5 w-1/2" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
};

export default Skeleton;
