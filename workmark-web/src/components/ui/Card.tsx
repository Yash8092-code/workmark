import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'raised' | 'inset' | 'interactive' | 'soft' | 'primary' | 'dark';
  className?: string;
  onClick?: () => void;
  id?: string;
}

export const Card: React.FC<CardProps> & {
  Header: React.FC<{ children: React.ReactNode; className?: string }>;
  Body: React.FC<{ children: React.ReactNode; className?: string }>;
  Footer: React.FC<{ children: React.ReactNode; className?: string }>;
} = ({ children, variant = 'default', className, onClick, id }) => {
  const variantClasses = {
    default: 'clay-card',
    raised: 'clay-card-raised',
    inset: 'clay-card-inset',
    interactive: 'clay-card clay-interactive cursor-pointer',
    soft: 'clay-card-soft',
    primary: 'clay-card-primary',
    dark: 'clay-card-dark',
  };

  return (
    <div
      id={id}
      className={cn(
        variantClasses[variant],
        onClick && 'cursor-pointer clay-interactive',
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
    <div className={cn('px-6 py-4.5 border-b border-[rgba(232,231,245,0.7)]', className)}>
      {children}
    </div>
  );
};

Card.Body = ({ children, className }) => {
  return (
    <div className={cn('px-6 py-5', className)}>
      {children}
    </div>
  );
};

Card.Footer = ({ children, className }) => {
  return (
    <div className={cn('px-6 py-4 border-t border-[rgba(232,231,245,0.7)]', className)}>
      {children}
    </div>
  );
};

export default Card;
