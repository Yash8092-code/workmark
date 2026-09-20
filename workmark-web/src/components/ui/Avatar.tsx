import React from 'react';
import { cn } from '../../utils/cn';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'rounded';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  shape = 'rounded',
  className,
}) => {
  const sizeStyles = {
    xs: 'h-7 w-7 text-[10px]',
    sm: 'h-9 w-9 text-xs',
    md: 'h-11 w-11 text-sm',
    lg: 'h-14 w-14 text-base',
    xl: 'h-20 w-20 text-xl',
    '2xl': 'h-28 w-28 text-2xl',
  };

  const shapeStyles = {
    circle: 'rounded-full',
    rounded: 'rounded-2xl',
  };

  const getInitials = (fullName?: string) => {
    if (!fullName) return '?';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div
      className={cn(
        'relative flex items-center justify-center font-black overflow-hidden flex-shrink-0 shadow-xs border border-white/80',
        shapeStyles[shape],
        sizeStyles[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#7C6EF8] to-[#5146C7] text-white flex items-center justify-center tracking-wider">
          {getInitials(name)}
        </div>
      )}
    </div>
  );
};

export default Avatar;
