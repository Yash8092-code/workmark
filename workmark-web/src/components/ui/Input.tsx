import React, { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, rightElement, helperText, className, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs sm:text-sm font-bold text-slate-200 mb-1.5 tracking-tight">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'genz-input-surface w-full px-4 py-2.5 text-sm sm:text-base text-slate-100 placeholder-slate-500 transition-all duration-200',
              icon && 'pl-10.5',
              rightElement && 'pr-11',
              error && 'border-red-500/60 focus:border-red-500 focus:ring-red-500/25 bg-red-950/20',
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400">
              {rightElement}
            </div>
          )}
        </div>
        {error ? (
          <p className="mt-1.5 text-xs font-semibold text-rose-400 flex items-center gap-1">
            <span>•</span> {error}
          </p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
