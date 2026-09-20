import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#030712] text-slate-100 selection:bg-cyan-500/25 selection:text-cyan-300 overflow-x-hidden">
      {/* Portfolio-inspired Grid Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:40px_40px]" />
        {/* Ambient Animated Floating Orbs */}
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] animate-float pointer-events-none" />
        <div className="absolute top-1/3 -right-28 w-[550px] h-[550px] bg-purple-600/10 rounded-full blur-[150px] animate-float-delayed pointer-events-none" />
        <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] animate-pulse-slow pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
};
