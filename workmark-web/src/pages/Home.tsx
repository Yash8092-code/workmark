import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { JobSearch } from '../components/jobs/JobSearch';
import { FeaturedJobs } from '../components/jobs/FeaturedJobs';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { getCountryDisplayName, getCountryFlag } from '../utils/countries';
import {
  Code2,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  Globe2,
  ShieldCheck,
  Terminal,
  Zap,
  Flame,
  CheckCircle2,
  Smartphone,
  Palette,
  Database,
  Cloud,
  ChevronRight,
} from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const userCountryFlag = getCountryFlag(user?.countryCode);
  const userCountryName = getCountryDisplayName(user?.countryCode);

  const domains = [
    {
      name: 'Software Engineer',
      icon: Code2,
      count: '3,450+ roles',
      gradient: 'from-cyan-500/20 to-blue-500/10',
      badge: 'High Demand',
      badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    },
    {
      name: 'Full Stack Developer',
      icon: Layers,
      count: '2,890+ roles',
      gradient: 'from-indigo-500/20 to-purple-500/10',
      badge: 'Trending',
      badgeColor: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
    },
    {
      name: 'Machine Learning & AI',
      icon: Cpu,
      count: '1,720+ roles',
      gradient: 'from-fuchsia-500/20 to-pink-500/10',
      badge: '🔥 Hot',
      badgeColor: 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10',
    },
    {
      name: 'DevOps & Cloud',
      icon: Cloud,
      count: '1,410+ roles',
      gradient: 'from-sky-500/20 to-emerald-500/10',
      badge: 'High Pay',
      badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    },
    {
      name: 'Mobile Engineer (iOS/Android)',
      icon: Smartphone,
      count: '980+ roles',
      gradient: 'from-amber-500/20 to-orange-500/10',
      badge: 'Active',
      badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    },
    {
      name: 'UI/UX & Product Design',
      icon: Palette,
      count: '840+ roles',
      gradient: 'from-pink-500/20 to-rose-500/10',
      badge: 'Design',
      badgeColor: 'text-pink-400 border-pink-500/30 bg-pink-500/10',
    },
    {
      name: 'Data Engineering & Analytics',
      icon: Database,
      count: '1,320+ roles',
      gradient: 'from-teal-500/20 to-cyan-500/10',
      badge: 'Data',
      badgeColor: 'text-teal-400 border-teal-500/30 bg-teal-500/10',
    },
    {
      name: 'Backend Systems Engineer',
      icon: Terminal,
      count: '2,140+ roles',
      gradient: 'from-blue-500/20 to-indigo-500/10',
      badge: 'Core',
      badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    },
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
      {/* Gen-Z Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 border-b border-white/5 bg-[#090D16]">
        {/* Ambient Neon Lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[380px] bg-gradient-to-b from-[#327CF6]/20 via-[#38BDF8]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-40 right-10 w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            {/* Live takeuforward style pulse pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-black tracking-wide mb-6 shadow-lg shadow-cyan-500/10 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              {isAuthenticated ? (
                <span>
                  Feed personalized for {user?.name.split(' ')[0]} {userCountryFlag} {userCountryName}
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  <span>50,000+ Active Roles • Direct Apply • Zero Friction</span>
                </span>
              )}
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.08] mb-6">
              Level up your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] via-[#818CF8] to-[#C084FC]">
                tech career
              </span>.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8 font-medium">
              A lightning-fast platform designed for engineers, developers, and builders. Curated direct postings, deterministic skill matching, and instant worldwide discovery.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                onClick={() => navigate(user?.countryCode ? `/jobs?country=${user.countryCode}` : '/jobs')}
                className="genz-btn-primary font-black px-8 py-3.5 rounded-xl shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all text-sm"
              >
                <span>Explore Opportunities</span>
                <ArrowRight className="h-4 w-4 ml-2 stroke-[2.5]" />
              </Button>
              {!isAuthenticated && (
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => navigate('/register')}
                  className="bg-slate-900/80 hover:bg-slate-800 text-white font-bold rounded-xl border border-white/10 px-6 text-sm"
                >
                  Join Community
                </Button>
              )}
            </div>
          </div>

          {/* Search Box in Hero */}
          <div className="mt-8">
            <JobSearch onSearch={handleSearch} initialCountry={user?.countryCode || ''} />
          </div>

          {/* Quick Domain Tags */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-400">
            <span className="text-slate-500">Trending searches:</span>
            {['React', 'Node.js', 'Python', 'AI/ML', 'Remote', 'Go', 'Full Stack'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => navigate(`/jobs?keyword=${encodeURIComponent(tag)}`)}
                className="px-3 py-1 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Domains - Bento Grid */}
      <section className="py-20 bg-[#0B0F17] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2 border border-cyan-500/20">
                <Zap className="h-3.5 w-3.5" />
                <span>Curated Tech Tracks</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Explore by Domain
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Handcrafted tracks for modern engineering and tech stacks
              </p>
            </div>
            <Link
              to="/jobs"
              className="text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group transition-colors"
            >
              <span>View all tracks</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {domains.map((dom) => {
              const Icon = dom.icon;
              return (
                <button
                  key={dom.name}
                  type="button"
                  onClick={() => navigate(`/jobs?keyword=${encodeURIComponent(dom.name)}`)}
                  className="genz-card p-5 text-left group hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
                >
                  <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${dom.gradient} rounded-full blur-2xl pointer-events-none`} />

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="h-11 w-11 rounded-xl bg-slate-900 border border-white/10 text-cyan-400 flex items-center justify-center group-hover:border-cyan-500/40 group-hover:text-cyan-300 transition-colors shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${dom.badgeColor}`}>
                        {dom.badge}
                      </span>
                    </div>

                    <h3 className="font-black text-white text-base mb-1 group-hover:text-cyan-300 transition-colors">
                      {dom.name}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-slate-400">
                    <span>{dom.count}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <FeaturedJobs />

      {/* Why Gen-Z Chooses WorkMark */}
      <section className="py-20 bg-[#090D16] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2 border border-purple-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Built Different</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Why Tech Builders Choose WorkMark
            </h2>
            <p className="text-sm font-medium text-slate-400 mt-2">
              Say goodbye to black-hole job applications, spam emails, and endless verification hurdles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="genz-card p-7 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
              <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg mb-5 shadow-sm">
                <Globe2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-white mb-2">Location & Remote Radar</h3>
              <p className="text-sm font-medium text-slate-300 leading-relaxed">
                Filter instantly between domestic roles in your country or worldwide remote engineering teams. No geo-blocking surprises.
              </p>
            </div>

            <div className="genz-card p-7 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg mb-5 shadow-sm">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-white mb-2">Zero-Friction Access</h3>
              <p className="text-sm font-medium text-slate-300 leading-relaxed">
                Instant onboarding with no mandatory email OTP blocks or tedious waits. Create your username, pick your domains, and start applying.
              </p>
            </div>

            <div className="genz-card p-7 relative overflow-hidden group hover:border-purple-500/40 transition-all">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg mb-5 shadow-sm">
                <Terminal className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-white mb-2">Deterministic Tech Matching</h3>
              <p className="text-sm font-medium text-slate-300 leading-relaxed">
                Clear match percentages grounded on your chosen tech domains and skills. Know exactly where your strengths align before you apply.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Employer CTA */}
      <section className="py-20 bg-gradient-to-b from-[#0B0F17] to-[#090D16] text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="genz-card p-10 sm:p-14 border border-cyan-500/20 shadow-2xl shadow-cyan-950/40">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">
              Hiring top-tier engineering talent?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed font-medium">
              Reach thousands of ambitious developers, machine learning researchers, and designers looking for their next milestone.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="genz-btn-primary font-black px-8 py-3.5 rounded-xl shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all text-sm"
              >
                Post Open Roles
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => navigate('/jobs')}
                className="bg-slate-900/90 text-slate-200 border border-white/10 hover:bg-slate-800 font-bold px-8 py-3.5 rounded-xl text-sm"
              >
                Search Directory
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                <span>Direct applicant flow</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                <span>Verified tech profiles</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                <span>Instant candidate radar</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

