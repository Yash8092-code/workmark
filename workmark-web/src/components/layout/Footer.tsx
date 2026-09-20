import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#070A11] text-slate-300 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[150px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-14">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <BrandLogo to="/" size="md" />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed font-medium">
              Next-generation career matching and deterministic opportunity intelligence built for Gen-Z developers, designers, and tech leaders.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-400 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Zero Verification Friction • Instant Career Access</span>
            </div>

            {/* Social pills (takeuforward style) */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-cyan-400/50 hover:bg-slate-800 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-slate-800 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-slate-800 transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-rose-400 hover:border-rose-400/50 hover:bg-slate-800 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Opportunities Column */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-100 mb-4 flex items-center gap-1.5">
              <span>Opportunities</span>
            </h4>
            <ul className="space-y-2.5 text-sm font-semibold text-slate-400">
              <li>
                <Link to="/jobs" className="hover:text-cyan-300 transition-colors">
                  Discover Jobs
                </Link>
              </li>
              <li>
                <Link to="/jobs?workMode=remote" className="hover:text-cyan-300 transition-colors">
                  Remote Roles
                </Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-cyan-300 transition-colors">
                  Explore Companies
                </Link>
              </li>
              <li>
                <Link to="/seeker/dashboard" className="hover:text-cyan-300 transition-colors">
                  Career Radar
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers Column */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-100 mb-4">
              Recruiters
            </h4>
            <ul className="space-y-2.5 text-sm font-semibold text-slate-400">
              <li>
                <Link to="/employer/dashboard" className="hover:text-cyan-300 transition-colors">
                  Recruiter Console
                </Link>
              </li>
              <li>
                <Link to="/employer/jobs/create" className="hover:text-cyan-300 transition-colors">
                  Post New Opportunity
                </Link>
              </li>
              <li>
                <Link to="/employer/company" className="hover:text-cyan-300 transition-colors">
                  Company Profile
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-cyan-300 transition-colors">
                  Create Recruiter Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Column */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-100 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm font-semibold text-slate-400">
              <li>
                <Link to="/about" className="hover:text-cyan-300 transition-colors">
                  About Workmark
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-300 transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cyan-300 transition-colors">
                  Privacy & Data
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cyan-300 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-400">
          <p>&copy; {new Date().getFullYear()} Workmark Recruitment Ecosystem. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Engineered with</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-current" />
            <span>for high-performance tech careers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
