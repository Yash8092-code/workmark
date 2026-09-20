import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Bell, Briefcase, Bookmark, Layers, Building2, User, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useUnreadCount } from '../../hooks/useNotifications';
import { Avatar } from '../ui/Avatar';
import { DropdownMenu, DropdownItem, DropdownDivider } from '../ui/DropdownMenu';
import { Button } from '../ui/Button';
import { BrandLogo } from '../ui/BrandLogo';
import { getCountryFlag, getCountryDisplayName } from '../../utils/countries';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { data: unreadCount } = useUnreadCount();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const userCountryFlag = getCountryFlag(user?.countryCode);
  const userCountryName = getCountryDisplayName(user?.countryCode);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const linkClass = (path: string) =>
    `text-xs sm:text-sm font-semibold transition-all duration-200 py-1.5 px-3.5 rounded-xl flex items-center gap-1.5 ${
      isActive(path)
        ? 'bg-blue-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(56,189,248,0.15)] font-bold'
        : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
    }`;

  const JobSeekerNav = () => (
    <>
      <Link to="/seeker/dashboard" className={linkClass('/seeker/dashboard')}>
        <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
        <span>Command Center</span>
      </Link>
      <Link to="/jobs" className={linkClass('/jobs')}>
        <Briefcase className="h-3.5 w-3.5" />
        <span>Discover Jobs</span>
      </Link>
      <Link to="/seeker/applications" className={linkClass('/seeker/applications')}>
        <Layers className="h-3.5 w-3.5" />
        <span>Applications</span>
      </Link>
      <Link to="/seeker/saved-jobs" className={linkClass('/seeker/saved-jobs')}>
        <Bookmark className="h-3.5 w-3.5" />
        <span>Saved</span>
      </Link>
      <Link to="/seeker/profile" className={linkClass('/seeker/profile')}>
        <User className="h-3.5 w-3.5" />
        <span>Profile</span>
      </Link>
    </>
  );

  const EmployerNav = () => (
    <>
      <Link to="/employer/dashboard" className={linkClass('/employer/dashboard')}>
        <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
        <span>Dashboard</span>
      </Link>
      <Link to="/employer/jobs" className={linkClass('/employer/jobs')}>
        <Briefcase className="h-3.5 w-3.5" />
        <span>Manage Jobs</span>
      </Link>
      <Link to="/employer/company" className={linkClass('/employer/company')}>
        <Building2 className="h-3.5 w-3.5" />
        <span>Company Profile</span>
      </Link>
    </>
  );

  const AdminNav = () => (
    <>
      <Link to="/admin/dashboard" className={linkClass('/admin/dashboard')}>
        Dashboard
      </Link>
      <Link to="/admin/users" className={linkClass('/admin/users')}>
        Users
      </Link>
      <Link to="/admin/companies" className={linkClass('/admin/companies')}>
        Companies
      </Link>
      <Link to="/admin/jobs" className={linkClass('/admin/jobs')}>
        Jobs
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-6 pt-3 pb-2 transition-all">
      <div className="max-w-7xl mx-auto genz-floating-nav rounded-2xl sm:rounded-3xl px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 sm:h-18">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <BrandLogo to="/" size="md" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 p-1 bg-slate-950/60 rounded-2xl border border-white/10 backdrop-blur-md">
            {!isAuthenticated && (
              <>
                <Link to="/jobs" className={linkClass('/jobs')}>
                  Find Opportunities
                </Link>
                <Link to="/companies" className={linkClass('/companies')}>
                  Companies
                </Link>
                <Link to="/about" className={linkClass('/about')}>
                  About
                </Link>
                <Link to="/contact" className={linkClass('/contact')}>
                  Contact
                </Link>
                <Link
                  to="/register?role=employer"
                  className="px-3 py-1.5 rounded-xl text-xs font-black text-purple-300 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-all ml-1 flex items-center gap-1.5"
                >
                  <Building2 className="h-3.5 w-3.5 text-purple-400" />
                  <span>Hire Talent</span>
                </Link>
              </>
            )}

            {isAuthenticated && user?.role === 'job_seeker' && <JobSeekerNav />}
            {isAuthenticated && user?.role === 'employer' && <EmployerNav />}
            {isAuthenticated && user?.role === 'admin' && <AdminNav />}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden sm:flex items-center space-x-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register?role=employer"
                  className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:text-white text-xs font-bold transition-all"
                >
                  <Building2 className="h-3.5 w-3.5 text-purple-400" />
                  <span>For Employers</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="font-bold text-slate-300 hover:text-white"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
              </>
            ) : (
              <>
                {/* User Country Badge Indicator */}
                {user?.countryCode && (
                  <Link
                    to={user.role === 'job_seeker' ? '/seeker/profile/edit' : '/employer/company/edit'}
                    title={`Country: ${userCountryName}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-bold text-cyan-400 transition-all shadow-sm"
                  >
                    <span className="text-sm leading-none">{userCountryFlag}</span>
                    <span className="uppercase text-[11px] font-black">{user.countryCode}</span>
                  </Link>
                )}

                {/* Notifications Bell */}
                <Link
                  to="/notifications"
                  aria-label="View Notifications"
                  className="relative p-2.5 text-slate-400 hover:text-cyan-400 hover:bg-white/10 rounded-2xl transition-all"
                >
                  <Bell className="h-4.5 w-4.5" />
                  {unreadCount && unreadCount > 0 ? (
                    <span className="absolute top-1 right-1 h-4.5 min-w-[18px] px-1 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  ) : null}
                </Link>

                {/* User Dropdown */}
                {user && (
                  <DropdownMenu
                    trigger={
                      <div className="flex items-center gap-2 p-0.5 rounded-2xl hover:ring-2 hover:ring-cyan-400/40 transition-all cursor-pointer">
                        <Avatar src={user.avatar} name={user.name} size="sm" shape="rounded" />
                      </div>
                    }
                  >
                    <div className="px-4 py-3 border-b border-white/10 bg-slate-900 text-slate-100">
                      <p className="text-sm font-black truncate text-white">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate font-medium">{user.email}</p>
                      {user.username && (
                        <p className="text-[11px] text-cyan-400 font-bold tracking-tight">@{user.username}</p>
                      )}
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="text-[10px] py-0.5 px-2 bg-blue-500/20 text-cyan-400 font-bold rounded-lg uppercase border border-blue-500/30">
                          {user.role === 'job_seeker' ? 'Job Seeker' : user.role === 'employer' ? 'Recruiter' : 'Admin'}
                        </span>
                        {user.countryCode && (
                          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                            <span>{userCountryFlag}</span>
                            <span>{userCountryName}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    {user.role === 'job_seeker' && (
                      <>
                        <DropdownItem onClick={() => navigate('/seeker/dashboard')}>
                          Career Command Center
                        </DropdownItem>
                        <DropdownItem onClick={() => navigate('/seeker/profile')}>
                          My Profile
                        </DropdownItem>
                        <DropdownItem onClick={() => navigate('/seeker/profile/edit')}>
                          Edit Profile & Preferences
                        </DropdownItem>
                        <DropdownItem onClick={() => navigate('/seeker/applications')}>
                          My Applications
                        </DropdownItem>
                      </>
                    )}
                    {user.role === 'employer' && (
                      <>
                        <DropdownItem onClick={() => navigate('/employer/dashboard')}>
                          Recruitment Command Center
                        </DropdownItem>
                        <DropdownItem onClick={() => navigate('/employer/company')}>
                          Company Profile
                        </DropdownItem>
                        <DropdownItem onClick={() => navigate('/employer/company/edit')}>
                          Edit Organization Details
                        </DropdownItem>
                        <DropdownItem onClick={() => navigate('/employer/jobs')}>
                          Manage Job Postings
                        </DropdownItem>
                      </>
                    )}
                    <DropdownDivider />
                    <DropdownItem onClick={handleLogout} danger>
                      Sign Out
                    </DropdownItem>
                  </DropdownMenu>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            {isAuthenticated && (
              <Link
                to="/notifications"
                className="relative p-2 text-slate-400 hover:text-cyan-400 rounded-xl"
              >
                <Bell className="h-5 w-5" />
                {unreadCount && unreadCount > 0 ? (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                ) : null}
              </Link>
            )}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-200 hover:bg-white/10 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10 space-y-3 animate-in fade-in duration-150">
            <div className="flex flex-col space-y-1">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/jobs"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2.5 text-sm font-bold text-slate-200 rounded-xl hover:bg-white/5 hover:text-cyan-400"
                  >
                    Find Opportunities
                  </Link>
                  <Link
                    to="/companies"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2.5 text-sm font-bold text-slate-200 rounded-xl hover:bg-white/5 hover:text-cyan-400"
                  >
                    Companies
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2.5 text-sm font-bold text-slate-200 rounded-xl hover:bg-white/5 hover:text-cyan-400"
                  >
                    About Workmark
                  </Link>
                  <Link
                    to="/register?role=employer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2.5 text-sm font-bold text-purple-300 rounded-xl hover:bg-purple-500/10 flex items-center gap-2"
                  >
                    <Building2 className="h-4 w-4 text-purple-400" />
                    <span>Hire Talent / Employer Portal</span>
                  </Link>
                  <div className="pt-3 grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/login');
                      }}
                      className="w-full justify-center"
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/register');
                      }}
                      className="w-full justify-center"
                    >
                      Sign Up
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 mb-2 bg-slate-900 rounded-2xl border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-white">{user?.name}</p>
                      <p className="text-[11px] text-slate-400">{user?.email}</p>
                      {user?.username && (
                        <p className="text-[10px] text-cyan-400 font-bold">@{user.username}</p>
                      )}
                    </div>
                    {user?.countryCode && (
                      <span className="text-sm">{userCountryFlag}</span>
                    )}
                  </div>

                  {user?.role === 'job_seeker' && (
                    <>
                      <Link
                        to="/seeker/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-4 py-2.5 text-sm font-bold text-slate-200 rounded-xl hover:bg-white/5 hover:text-cyan-400"
                      >
                        Career Command Center
                      </Link>
                      <Link
                        to="/jobs"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-4 py-2.5 text-sm font-bold text-slate-200 rounded-xl hover:bg-white/5 hover:text-cyan-400"
                      >
                        Discover Jobs
                      </Link>
                      <Link
                        to="/seeker/applications"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-4 py-2.5 text-sm font-bold text-slate-200 rounded-xl hover:bg-white/5 hover:text-cyan-400"
                      >
                        My Applications
                      </Link>
                      <Link
                        to="/seeker/saved-jobs"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-4 py-2.5 text-sm font-bold text-slate-200 rounded-xl hover:bg-white/5 hover:text-cyan-400"
                      >
                        Saved Jobs
                      </Link>
                      <Link
                        to="/seeker/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-4 py-2.5 text-sm font-bold text-slate-200 rounded-xl hover:bg-white/5 hover:text-cyan-400"
                      >
                        My Profile
                      </Link>
                    </>
                  )}

                  {user?.role === 'employer' && (
                    <>
                      <Link
                        to="/employer/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-4 py-2.5 text-sm font-bold text-slate-200 rounded-xl hover:bg-white/5 hover:text-cyan-400"
                      >
                        Recruitment Dashboard
                      </Link>
                      <Link
                        to="/employer/jobs"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-4 py-2.5 text-sm font-bold text-slate-200 rounded-xl hover:bg-white/5 hover:text-cyan-400"
                      >
                        Manage Jobs
                      </Link>
                      <Link
                        to="/employer/company"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-4 py-2.5 text-sm font-bold text-slate-200 rounded-xl hover:bg-white/5 hover:text-cyan-400"
                      >
                        Company Profile
                      </Link>
                    </>
                  )}

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-400 rounded-xl hover:bg-red-500/10 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
