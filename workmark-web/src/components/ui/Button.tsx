import React, { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger' | 'soft';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  isLoading?: boolean;
  isBusy?: boolean;
  as?: 'button' | 'span' | 'div';
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      isLoading = false,
      isBusy = false,
      disabled,
      as = 'button',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isActuallyBusy = loading || isLoading || isBusy;
    const baseStyles =
      'clay-btn inline-flex items-center justify-center font-bold tracking-tight rounded-2xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variantStyles = {
      primary: 'genz-btn-primary',
      secondary: 'genz-btn-secondary',
      outline:
        'bg-white/5 border border-white/15 text-slate-200 hover:bg-white/10 hover:border-cyan-400 hover:text-white shadow-sm active:translate-y-0.5',
      ghost:
        'genz-btn-ghost hover:bg-white/10 hover:text-white text-slate-400',
      success: 'genz-btn-success',
      danger: 'genz-btn-danger',
      soft: 'bg-blue-500/15 text-cyan-400 hover:bg-blue-500/25 active:translate-y-0.5 border border-blue-500/30',
    };

    const sizeStyles = {
      xs: 'px-2.5 py-1 text-xs rounded-xl',
      sm: 'px-3.5 py-1.5 text-xs sm:text-sm rounded-xl',
      md: 'px-5 py-2.5 text-sm rounded-2xl',
      lg: 'px-7 py-3.5 text-base rounded-2xl',
      icon: 'p-2.5 rounded-xl aspect-square',
    };

    const spinner = isActuallyBusy && (
      <svg
        className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    if (as === 'span') {
      return (
        <span
          className={cn(baseStyles, variantStyles[variant], sizeStyles[size], 'cursor-pointer', className)}
          {...(props as any)}
        >
          {spinner}
          {children}
        </span>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isActuallyBusy}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {spinner}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
