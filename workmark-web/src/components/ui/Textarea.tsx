import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const textareaId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-xs sm:text-sm font-bold text-slate-200 mb-1.5 tracking-tight">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'genz-input-surface w-full px-4 py-3 text-sm sm:text-base text-slate-100 placeholder-slate-500 bg-[#0B0F19] border border-white/12 focus:border-cyan-400 focus:outline-none rounded-xl transition-all duration-200 resize-y',
            error && 'border-rose-500 focus:ring-rose-500/20 bg-rose-950/20',
            className
          )}
          {...props}
        />
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

Textarea.displayName = 'Textarea';

export default Textarea;
