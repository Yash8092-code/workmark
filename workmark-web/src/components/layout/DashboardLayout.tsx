import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-cyan-500/25 selection:text-cyan-300 overflow-x-hidden">
      {/* Portfolio Grid Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute -top-32 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] animate-float pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[150px] animate-float-delayed pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />

        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-8">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content Area */}
            <main className="flex-1 lg:pl-72 min-w-0">
              {/* Mobile Sidebar Toggle Button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden mb-4 p-2.5 genz-card text-white hover:text-cyan-300 rounded-2xl flex items-center gap-2 text-xs font-bold cursor-pointer"
              >
                <Menu className="h-4 w-4" />
                <span>Workspace Menu</span>
              </button>

              {children}
            </main>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
