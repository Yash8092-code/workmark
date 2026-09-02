import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
  const variantStyles = {
    default: 'bg-[#E2E8F0] text-[#64748B]',
    success: 'bg-green-100 text-[#16A34A]',
    warning: 'bg-orange-100 text-[#D97706]',
    error: 'bg-red-100 text-[#DC2626]',
    info: 'bg-blue-100 text-[#2563EB]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
