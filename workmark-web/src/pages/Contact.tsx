import { useState } from 'react';
import type { FormEvent } from 'react';
import { Mail, MapPin, Send, CheckCircle2, MessageSquare, Clock } from 'lucide-react';
import { PublicLayout } from '../components/layout/PublicLayout';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const subject = encodeURIComponent(String(form.get('subject') || 'Workmark enquiry'));
    const message = encodeURIComponent(`Name: ${form.get('name')}\nEmail: ${form.get('email')}\n\n${form.get('message')}`);
    window.location.href = `mailto:contact@workmark.com?subject=${subject}&body=${message}`;
    setSent(true);
  };

  return (
    <PublicLayout>
      <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-lg shadow-cyan-500/10">
              <MessageSquare className="w-4 h-4" />
              <span>We're Here For You</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
              Get in Touch with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">
                Workmark
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed font-medium">
              Have questions about hiring elite engineering talent or accelerating your job search? Our team is available 24/7.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-start">
            {/* Contact Info Cards */}
            <div className="space-y-5">
              <div className="genz-card-raised p-6 sm:p-8">
                <h2 className="text-xl font-black text-white mb-6">Direct Channels</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-cyan-500/30 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg shadow-cyan-500/10">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Us</p>
                      <a href="mailto:contact@workmark.com" className="text-base font-black text-white hover:text-cyan-400 transition-colors">
                        contact@workmark.com
                      </a>
                      <p className="text-xs text-slate-400 mt-0.5">Average response time: &lt; 2 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-indigo-500/30 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 shadow-lg shadow-indigo-500/10">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Support Hours</p>
                      <p className="text-base font-black text-white">Global Round-the-Clock</p>
                      <p className="text-xs text-slate-400 mt-0.5">Monday to Friday (All Timezones)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-purple-500/30 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 shadow-lg shadow-purple-500/10">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">HQ & Global Reach</p>
                      <p className="text-base font-black text-white">Workmark Worldwide Network</p>
                      <p className="text-xs text-slate-400 mt-0.5">Serving tech hubs across 50+ countries</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="genz-card p-6 border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-indigo-500/5 to-purple-500/10">
                <h3 className="font-bold text-white text-base mb-1">Looking to hire engineering teams?</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Create a verified employer profile, post vacancies, and access verified developers with zero friction.
                </p>
                <a href="/register?role=employer" className="genz-btn-primary py-2.5 px-4 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-lg shadow-cyan-500/20">
                  Launch Employer Console
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="genz-card-raised p-8 sm:p-10">
              <h2 className="text-2xl font-black text-white mb-2">Send us a direct message</h2>
              <p className="text-sm text-slate-300 mb-8 font-medium">Fill in the details below and we'll connect with you right away.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input label="Your Name" name="name" required placeholder="Jane Doe" className="rounded-2xl bg-slate-900/80 border-white/10 text-white" />
                <Input label="Email Address" name="email" type="email" required placeholder="jane@example.com" className="rounded-2xl bg-slate-900/80 border-white/10 text-white" />
                <Input label="Subject" name="subject" required placeholder="How can we assist you?" className="rounded-2xl bg-slate-900/80 border-white/10 text-white" />
                <Textarea label="Message" name="message" required rows={5} placeholder="Write your message here..." className="rounded-2xl bg-slate-900/80 border-white/10 text-white" />

                <Button type="submit" className="w-full py-3.5 rounded-2xl genz-btn-primary flex items-center justify-center gap-2 font-bold shadow-xl shadow-cyan-500/25 hover:scale-[1.01] transition-transform">
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </Button>

                {sent && (
                  <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-semibold shadow-lg shadow-emerald-500/10">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <span>Your default email client should open with your message prepared.</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
