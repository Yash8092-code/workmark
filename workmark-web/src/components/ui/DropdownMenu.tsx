import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ trigger, children, align = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute top-full mt-2 w-48 bg-[#0E1626] border border-white/15 rounded-xl shadow-2xl py-1.5 z-50 backdrop-blur-xl',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({ children, onClick, icon, danger }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center px-4 py-2.5 text-sm text-left font-medium transition-colors',
        danger
          ? 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/15'
          : 'text-slate-200 hover:text-white hover:bg-white/10'
      )}
    >
      {icon && <span className="mr-3">{icon}</span>}
      {children}
    </button>
  );
};

export const DropdownDivider: React.FC = () => {
  return <div className="my-1 border-t border-white/10" />;
};
