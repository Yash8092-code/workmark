import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  to?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  to = '/',
}) => {
  const iconSizes = {
    sm: 'h-7 w-7 text-xs rounded-lg',
    md: 'h-9 w-9 text-base rounded-xl',
    lg: 'h-11 w-11 text-lg rounded-2xl',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const logoContent = (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Monogram Icon */}
      <div
        className={`${iconSizes[size]} bg-gradient-to-tr from-[#0F172A] via-[#1E293B] to-[#2563EB] text-white flex items-center justify-center font-black tracking-wider shadow-md shadow-[#2563EB]/25 group-hover:scale-105 transition-transform duration-200 border border-white/15`}
      >
        <span>W</span>
      </div>

      {/* Brand Text */}
      {showText && (
        <span className={`${textSizes[size]} font-extrabold tracking-tight text-[#0F172A]`}>
          WORK<span className="text-[#2563EB]">MARK</span>
        </span>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-block focus:outline-hidden">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};
