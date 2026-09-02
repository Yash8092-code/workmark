import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  FileText,
  User
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const jobSeekerItems = [
    { path: '/seeker/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/jobs', label: 'Browse Jobs', icon: Briefcase },
    { path: '/seeker/saved-jobs', label: 'Saved Jobs', icon: FileText },
    { path: '/seeker/applications', label: 'Applications', icon: FileText },
    { path: '/seeker/profile', label: 'Profile', icon: User },
  ];

  const employerItems = [
    { path: '/employer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/employer/jobs', label: 'My Jobs', icon: Briefcase },
    { path: '/employer/company', label: 'Company', icon: Building2 },
  ];

  const adminItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/companies', label: 'Companies', icon: Building2 },
    { path: '/admin/jobs', label: 'Jobs', icon: Briefcase },
    { path: '/admin/reports', label: 'Reports', icon: FileText },
  ];

  const getItems = () => {
    if (user?.role === 'admin') return adminItems;
    if (user?.role === 'employer') return employerItems;
    return jobSeekerItems;
  };

  const items = getItems();

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-[#E2E8F0] transition-transform duration-300 z-30',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0'
      )}
    >
      <nav className="p-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                isActive(item.path)
                  ? 'bg-[#2563EB] text-white'
                  : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#172033]'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
