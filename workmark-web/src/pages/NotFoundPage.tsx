import React from 'react';
import { Link } from 'react-router-dom';
import { Home as HomeIcon, Compass } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[#030712] flex items-center justify-center px-4 py-12 overflow-hidden selection:bg-cyan-500/25 selection:text-cyan-300">
      {/* Portfolio Grid Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[140px] animate-float pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] animate-float-delayed pointer-events-none" />
      </div>

      <div className="relative z-10 genz-card-raised p-8 sm:p-14 max-w-lg w-full text-center">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 shadow-xl shadow-cyan-500/20 animate-float">
          <Compass className="h-10 w-10 animate-spin-slow" />
        </div>
        <h1 className="text-7xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 tracking-tight mb-2">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Page Not Found</h2>
        <p className="text-sm sm:text-base text-slate-300 mb-8 font-medium leading-relaxed">
          The page or opportunity you are looking for might have been moved, renamed, or is temporarily unavailable.
        </p>
        <Link to="/">
          <Button size="lg" className="w-full sm:w-auto px-8 py-3.5 rounded-2xl genz-btn-primary font-bold inline-flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 hover:scale-105 transition-transform">
            <HomeIcon className="h-4 w-4" />
            <span>Return to Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};
