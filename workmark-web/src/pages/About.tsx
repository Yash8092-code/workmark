import React from 'react';
import { PublicLayout } from '../components/layout/PublicLayout';
import { Target, Users, Award, Heart, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fadeIn text-slate-100">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Our Mission & Vision</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            About Workmark
          </h1>
          <p className="text-lg font-medium text-slate-300 max-w-2xl mx-auto">
            We are building the most transparent, deterministic, and human-centric career recruitment platform in the world.
          </p>
        </div>

        {/* Mission */}
        <section className="mb-16">
          <div className="genz-card p-8 md:p-12 border border-white/10 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
              <div className="bg-cyan-500/15 text-cyan-300 p-4 rounded-2xl border border-cyan-500/25 shrink-0">
                <Target className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white mb-3">Our Core Mission</h2>
                <p className="text-slate-300 font-medium text-base sm:text-lg leading-relaxed">
                  Workmark was created to bridge the gap between talented professionals and forward-thinking companies.
                  We believe that finding the right job should be simple, transparent, and empowering. Our platform
                  provides verified tools, location-aware matching, deterministic Opportunity Intelligence, and robust interview pipelines to connect talent and employers meaningfully.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-black text-white text-center mb-12">Our Guiding Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="genz-card p-8 text-center border border-white/10">
              <div className="bg-indigo-500/15 text-indigo-300 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-indigo-500/25">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-black text-white mb-2">People First</h3>
              <p className="text-sm font-medium text-slate-300 leading-relaxed">
                We prioritize user privacy, direct employer contact protection, and genuine transparency across every stage of recruitment.
              </p>
            </div>

            <div className="genz-card p-8 text-center border border-white/10">
              <div className="bg-cyan-500/15 text-cyan-300 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-cyan-500/25">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-black text-white mb-2">Excellence & Polish</h3>
              <p className="text-sm font-medium text-slate-300 leading-relaxed">
                We strive for state-of-the-art aesthetics, tactile interactions, and reliable recruitment state synchronization.
              </p>
            </div>

            <div className="genz-card p-8 text-center border border-white/10">
              <div className="bg-emerald-500/15 text-emerald-300 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-emerald-500/25">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-black text-white mb-2">Deterministic Integrity</h3>
              <p className="text-sm font-medium text-slate-300 leading-relaxed">
                No black-box algorithms or AI hallucinations. Transparent scoring criteria that candidates can understand and trust.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="genz-card p-10 sm:p-12 mb-16 border border-white/10 bg-slate-900/90">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl sm:text-5xl font-black text-cyan-400 mb-1">10K+</p>
              <p className="text-sm font-bold text-slate-300">Active Verified Jobs</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-black text-indigo-400 mb-1">50K+</p>
              <p className="text-sm font-bold text-slate-300">Skilled Candidates</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-black text-emerald-400 mb-1">5K+</p>
              <p className="text-sm font-bold text-slate-300">Leading Organizations</p>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="genz-card p-8 sm:p-12 text-center max-w-3xl mx-auto border border-white/10">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Get in Touch</h2>
          <p className="text-sm font-medium text-slate-300 mb-6 max-w-lg mx-auto leading-relaxed">
            Have questions or want to partner with Workmark? We would love to hear from your team.
          </p>
          <Link to="/contact">
            <Button variant="primary" size="lg" className="genz-btn-primary">
              Contact Support
            </Button>
          </Link>
        </section>
      </div>
    </PublicLayout>
  );
};
