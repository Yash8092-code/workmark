import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> & {
  Header: React.FC<CardProps>;
  Body: React.FC<CardProps>;
  Footer: React.FC<CardProps>;
} = ({ children, className, onClick }) => {
  return (
    <div
      className={cn(
        'bg-white border border-[#E2E8F0] rounded-lg shadow-sm',
        onClick && 'cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

Card.Header = ({ children, className }) => {
  return (
    <div className={cn('px-6 py-4 border-b border-[#E2E8F0]', className)}>
      {children}
    </div>
  );
};

Card.Body = ({ children, className }) => {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  );
};

Card.Footer = ({ children, className }) => {
  return (
    <div className={cn('px-6 py-4 border-t border-[#E2E8F0]', className)}>
      {children}
    </div>
  );
};
