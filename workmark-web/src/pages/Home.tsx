import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { JobSearch } from '../components/jobs/JobSearch';
import { FeaturedJobs } from '../components/jobs/FeaturedJobs';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { getCountryDisplayName, getCountryFlag } from '../utils/countries';
import {
  Code,
  Palette,
  TrendingUp,
  DollarSign,
  Package,
  Database,
  Users,
  Briefcase,
  BarChart,
  HeadphonesIcon,
  Sparkles,
  ArrowRight,
  Globe,
  ShieldCheck,
} from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const userCountryFlag = getCountryFlag(user?.countryCode);
  const userCountryName = getCountryDisplayName(user?.countryCode);

  const categories = [
    { name: 'Engineering', icon: Code, count: '1,200+ roles' },
    { name: 'Design', icon: Palette, count: '540+ roles' },
    { name: 'Marketing', icon: TrendingUp, count: '890+ roles' },
    { name: 'Sales', icon: DollarSign, count: '450+ roles' },
    { name: 'Product', icon: Package, count: '320+ roles' },
    { name: 'Data', icon: Database, count: '670+ roles' },
    { name: 'HR', icon: Users, count: '230+ roles' },
    { name: 'Operations', icon: Briefcase, count: '180+ roles' },
    { name: 'Finance', icon: BarChart, count: '340+ roles' },
    { name: 'Customer Support', icon: HeadphonesIcon, count: '410+ roles' },
  ];

  const handleSearch = (keyword: string, location: string, country: string) => {
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (location) params.set('location', location);
    if (country && country !== 'all') params.set('country', country);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-mesh-gradient text-white py-20 sm:py-28">
        {/* Subtle ambient lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            {isAuthenticated ? (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-semibold uppercase tracking-wider mb-6">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                <span>
                  Welcome back, {user?.name.split(' ')[0]} • Feed tuned to {userCountryFlag} {userCountryName}
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-semibold uppercase tracking-wider mb-6">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                <span>Next-Generation Career Platform</span>
              </div>
            )}

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
              Find where you <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">belong</span>.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
              Personalized career discovery matching your target country, skill profile, and remote preferences. Curated direct listings and verified worldwide roles.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                onClick={() => navigate(user?.countryCode ? `/jobs?country=${user.countryCode}` : '/jobs')}
                className="bg-white text-[#0F172A] hover:bg-slate-100 font-bold px-7 rounded-xl shadow-lg shadow-white/10"
              >
                <span>Browse Opportunities</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
              {!isAuthenticated && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/register')}
                  className="border-white/30 text-white hover:bg-white/10 font-bold rounded-xl"
                >
                  Create Account
                </Button>
              )}
            </div>
          </div>

          {/* Search Box in Hero */}
          <div className="mt-8">
            <JobSearch onSearch={handleSearch} initialCountry={user?.countryCode || ''} />
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20 bg-white subtle-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-1 block">
                Explore Domains
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Trending Categories
              </h2>
            </div>
            <Link
              to="/jobs"
              className="text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 group"
            >
              <span>Explore all categories</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => navigate(`/jobs?category=${encodeURIComponent(category.name)}`)}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 text-center hover:shadow-lg hover:border-[#2563EB]/40 hover:-translate-y-1 transition-all group cursor-pointer"
                >
                  <div className="h-12 w-12 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center mx-auto mb-3.5 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                    <Icon className="h-6 w-6 text-[#2563EB]" />
                  </div>
                  <h3 className="font-bold text-[#0F172A] text-sm mb-0.5">{category.name}</h3>
                  <p className="text-xs text-[#64748B]">{category.count}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <FeaturedJobs />

      {/* Platform Value Proposition */}
      <section className="py-20 bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-1 block">
              Built for Modern Careers
            </span>
            <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Why Professionals Choose Workmark
            </h2>
            <p className="text-sm text-[#64748B] mt-2">
              A curated discovery experience designed to respect your location preferences and time
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-xs">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-lg mb-5">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">Location Intelligence</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Prioritize opportunities in your home country or intentionally toggle to worldwide remote positions with zero noise.
              </p>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-xs">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center font-bold text-lg mb-5">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">Verified Direct Listings</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Every job clearly indicates its source—direct employer applications vs. external listings—with transparent salary ranges.
              </p>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-xs">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center font-bold text-lg mb-5">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">Smart Digests & Alerts</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Receive thoughtful email alerts matching your exact role criteria without spamming your inbox.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Employer CTA */}
      <section className="py-20 hero-mesh-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Looking to Hire Top Engineering & Product Talent?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Post your openings on Workmark to connect with pre-screened international and local candidates.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-white text-[#0F172A] hover:bg-slate-100 font-bold px-8 rounded-xl shadow-lg shadow-white/10"
            >
              Post a Position
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
