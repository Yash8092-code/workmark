import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Briefcase,
  Users,
  Building2,
  User,
  Bookmark,
  Layers,
  PlusCircle,
  BarChart3,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../hooks/useAuth';

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) =>
    location.pathname === path || (path !== '/' && location.pathname.startsWith(path + '/'));

  const jobSeekerItems = [
    { path: '/seeker/dashboard', label: 'Career Hub', icon: Sparkles },
    { path: '/jobs', label: 'Discover Jobs', icon: Briefcase },
    { path: '/seeker/applications', label: 'Applications', icon: Layers },
    { path: '/seeker/saved-jobs', label: 'Saved Jobs', icon: Bookmark },
    { path: '/seeker/profile', label: 'My Profile', icon: User },
  ];

  const employerItems = [
    { path: '/employer/dashboard', label: 'Command Center', icon: Sparkles },
    { path: '/employer/jobs', label: 'Job Postings', icon: Briefcase },
    { path: '/employer/jobs/create', label: 'Post New Job', icon: PlusCircle },
    { path: '/employer/company', label: 'Company Profile', icon: Building2 },
  ];

  const adminItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: Sparkles },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/companies', label: 'Companies', icon: Building2 },
    { path: '/admin/jobs', label: 'Jobs', icon: Briefcase },
    { path: '/admin/reports', label: 'Reports', icon: BarChart3 },
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
        'fixed left-4 top-24 bottom-6 w-64 p-3 transition-all duration-300 z-30 hidden lg:block bg-[#0E1526]/90 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl overflow-y-auto',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0'
      )}
    >
      <div className="px-3 py-2.5 mb-2">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
          {user?.role === 'job_seeker' ? 'Seeker Workspace' : user?.role === 'employer' ? 'Recruiter Hub' : 'Admin Area'}
        </span>
      </div>
      <nav className="space-y-1.5">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200',
                active
                  ? 'clay-pill-active text-white'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
