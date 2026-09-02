import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: {
    value: number;
    direction: 'up' | 'down';
  };
  iconBgColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  change,
  iconBgColor = 'bg-[#2563EB]',
}) => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[#64748B] text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold text-[#172033] mb-2">{value}</p>
          {change && (
            <div
              className={cn(
                'flex items-center text-sm font-medium',
                change.direction === 'up' ? 'text-[#16A34A]' : 'text-[#DC2626]'
              )}
            >
              {change.direction === 'up' ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span>{Math.abs(change.value)}% from last month</span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-lg text-white', iconBgColor)}>
          {icon}
        </div>
      </div>
    </div>
  );
};
