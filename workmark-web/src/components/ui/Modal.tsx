import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-5xl',
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Floating Clay Modal Dialog */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={cn(
          'relative clay-card-raised w-full max-h-[90vh] overflow-y-auto bg-[#0E1626] border border-white/10 text-white z-10 animate-in zoom-in-95 duration-200 p-0 shadow-2xl rounded-3xl',
          sizeStyles[size]
        )}
      >
        {title && (
          <div className="flex items-start justify-between px-6 sm:px-8 py-5 border-b border-white/10 sticky top-0 bg-[#0E1626]/95 backdrop-blur-md z-10 rounded-t-3xl">
            <div>
              <h2 id="modal-title" className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {title}
              </h2>
              {description && (
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors -mr-2 -mt-1 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        <div className="px-6 sm:px-8 py-6">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
