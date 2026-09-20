import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, children, id, ...props }, ref) => {
    const selectId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-xs sm:text-sm font-bold text-slate-200 mb-1.5 tracking-tight">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'genz-input-surface w-full px-4 py-2.5 text-sm sm:text-base text-slate-100 bg-[#0B0F19] border border-white/12 focus:border-cyan-400 focus:outline-none transition-all duration-200 cursor-pointer rounded-xl',
            error && 'border-rose-500 focus:ring-rose-500/20 bg-rose-950/20',
            className
          )}
          {...props}
        >
          {options
            ? options.map((option) => (
                <option key={option.value} value={option.value} className="bg-[#0B0F19] text-slate-100">
                  {option.label}
                </option>
              ))
            : children}
        </select>
        {error && (
          <p className="mt-1.5 text-xs font-semibold text-[#FF6B81] flex items-center gap-1">
            <span>•</span> {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
