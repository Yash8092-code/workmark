import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Bell } from 'lucide-react';
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

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `text-sm font-semibold transition-colors duration-150 py-1.5 px-3 rounded-lg ${
      isActive(path)
        ? 'text-[#2563EB] bg-[#2563EB]/5 font-bold'
        : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
    }`;

  const JobSeekerNav = () => (
    <>
      <Link to="/jobs" className={linkClass('/jobs')}>
        Find Jobs
      </Link>
      <Link to="/seeker/saved-jobs" className={linkClass('/seeker/saved-jobs')}>
        Saved
      </Link>
      <Link to="/seeker/applications" className={linkClass('/seeker/applications')}>
        Applications
      </Link>
    </>
  );

  const EmployerNav = () => (
    <>
      <Link to="/employer/dashboard" className={linkClass('/employer/dashboard')}>
        Dashboard
      </Link>
      <Link to="/employer/jobs" className={linkClass('/employer/jobs')}>
        Manage Jobs
      </Link>
      <Link to="/employer/company" className={linkClass('/employer/company')}>
        Company Profile
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
    <header className="sticky top-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <BrandLogo to="/" size="md" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {!isAuthenticated && (
              <>
                <Link to="/jobs" className={linkClass('/jobs')}>
                  Find Jobs
                </Link>
                <Link to="/companies" className={linkClass('/companies')}>
                  Companies
                </Link>
                <Link to="/about" className={linkClass('/about')}>
                  About
                </Link>
              </>
            )}

            {isAuthenticated && user?.role === 'job_seeker' && <JobSeekerNav />}
            {isAuthenticated && user?.role === 'employer' && <EmployerNav />}
            {isAuthenticated && user?.role === 'admin' && <AdminNav />}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {!isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="rounded-xl font-semibold text-[#475569] hover:text-[#0F172A]"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/register')}
                  className="rounded-xl font-bold shadow-md shadow-[#2563EB]/20"
                >
                  Create Account
                </Button>
              </>
            ) : (
              <>
                {/* User Country Badge Indicator */}
                {user?.countryCode && (
                  <Link
                    to="/seeker/profile/edit"
                    title={`Preferred Country: ${userCountryName}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#E2E8F0] text-xs font-semibold text-[#334155] transition-colors"
                  >
                    <span className="text-base leading-none">{userCountryFlag}</span>
                    <span className="uppercase text-[11px] font-bold text-[#64748B]">{user.countryCode}</span>
                  </Link>
                )}

                {/* Notifications Bell */}
                <Link
                  to="/notifications"
                  className="relative p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-xl transition-colors"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount && unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-[#DC2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-subtle-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                {user && (
                  <DropdownMenu
                    trigger={
                      <div className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#2563EB]/20 transition-all cursor-pointer">
                        <Avatar src={user.avatar} name={user.name} size="sm" />
                      </div>
                    }
                  >
                    <div className="px-4 py-3 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                      <p className="text-sm font-bold text-[#0F172A] truncate">{user.name}</p>
                      <p className="text-xs text-[#64748B] truncate">{user.email}</p>
                      {user.countryCode && (
                        <p className="text-xs text-[#2563EB] font-semibold mt-1 flex items-center gap-1">
                          <span>{userCountryFlag}</span>
                          <span>{userCountryName}</span>
                        </p>
                      )}
                    </div>
                    {user.role === 'job_seeker' && (
                      <>
                        <DropdownItem onClick={() => navigate('/seeker/profile')}>
                          My Profile
                        </DropdownItem>
                        <DropdownItem onClick={() => navigate('/seeker/profile/edit')}>
                          Preferences & Settings
                        </DropdownItem>
                      </>
                    )}
                    {user.role === 'employer' && (
                      <>
                        <DropdownItem onClick={() => navigate('/employer/company')}>
                          Company Profile
                        </DropdownItem>
                        <DropdownItem onClick={() => navigate('/employer/jobs')}>
                          My Job Postings
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
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#E2E8F0] space-y-3 animate-in fade-in duration-150">
            <div className="flex flex-col space-y-1">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/jobs"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2 text-sm font-semibold text-[#334155] rounded-lg hover:bg-[#F1F5F9]"
                  >
                    Find Jobs
                  </Link>
                  <Link
                    to="/companies"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2 text-sm font-semibold text-[#334155] rounded-lg hover:bg-[#F1F5F9]"
                  >
                    Companies
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2 text-sm font-semibold text-[#334155] rounded-lg hover:bg-[#F1F5F9]"
                  >
                    About
                  </Link>
                  <div className="pt-3 grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/login');
                      }}
                      className="w-full justify-center rounded-xl"
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/register');
                      }}
                      className="w-full justify-center rounded-xl font-bold shadow-md shadow-[#2563EB]/20"
                    >
                      Sign Up
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="px-3 py-2 mb-2 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#0F172A]">{user?.name}</p>
                      <p className="text-[11px] text-[#64748B]">{user?.email}</p>
                    </div>
                    {user?.countryCode && (
                      <span className="text-sm">{userCountryFlag}</span>
                    )}
                  </div>

                  <Link
                    to="/jobs"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2 text-sm font-semibold text-[#334155] rounded-lg hover:bg-[#F1F5F9]"
                  >
                    Find Jobs
                  </Link>

                  {user?.role === 'job_seeker' && (
                    <>
                      <Link
                        to="/seeker/saved-jobs"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-3 py-2 text-sm font-semibold text-[#334155] rounded-lg hover:bg-[#F1F5F9]"
                      >
                        Saved Jobs
                      </Link>
                      <Link
                        to="/seeker/applications"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-3 py-2 text-sm font-semibold text-[#334155] rounded-lg hover:bg-[#F1F5F9]"
                      >
                        Applications
                      </Link>
                      <Link
                        to="/seeker/profile/edit"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-3 py-2 text-sm font-semibold text-[#334155] rounded-lg hover:bg-[#F1F5F9]"
                      >
                        Preferences & Country
                      </Link>
                    </>
                  )}

                  {user?.role === 'employer' && (
                    <>
                      <Link
                        to="/employer/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-3 py-2 text-sm font-semibold text-[#334155] rounded-lg hover:bg-[#F1F5F9]"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/employer/jobs"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-3 py-2 text-sm font-semibold text-[#334155] rounded-lg hover:bg-[#F1F5F9]"
                      >
                        My Jobs
                      </Link>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-semibold text-red-600 rounded-lg hover:bg-red-50"
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
