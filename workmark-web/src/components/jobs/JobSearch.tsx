import React, { useState, useEffect } from 'react';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { CountrySelector } from '../ui/CountrySelector';
import { Button } from '../ui/Button';

interface JobSearchProps {
  initialKeyword?: string;
  initialLocation?: string;
  initialCountry?: string;
  onSearch?: (keyword: string, location: string, country: string) => void;
  className?: string;
}

export const JobSearch: React.FC<JobSearchProps> = ({
  initialKeyword = '',
  initialLocation = '',
  initialCountry = '',
  onSearch,
  className = '',
}) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(initialLocation);
  const [country, setCountry] = useState(initialCountry);

  useEffect(() => {
    setKeyword(initialKeyword);
  }, [initialKeyword]);

  useEffect(() => {
    setLocation(initialLocation);
  }, [initialLocation]);

  useEffect(() => {
    setCountry(initialCountry);
  }, [initialCountry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(keyword, location, country);
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full max-w-5xl mx-auto ${className}`}>
      <div className="genz-card p-2 sm:p-2.5 flex flex-col md:flex-row items-center gap-2.5 bg-slate-900/80 backdrop-blur-2xl border border-white/15 shadow-[0_15px_40px_rgba(0,0,0,0.7)]">
        {/* Keyword Search */}
        <div className="flex-1 w-full flex items-center gap-2.5 px-4 py-2.5 bg-slate-950/80 rounded-xl border border-white/10 shadow-inner focus-within:border-cyan-400/60 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
          <Search className="h-4 w-4 text-cyan-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Job title, domain, or company..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-100 font-semibold placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        {/* Location input */}
        <div className="flex-1 w-full flex items-center gap-2.5 px-4 py-2.5 bg-slate-950/80 rounded-xl border border-white/10 shadow-inner focus-within:border-cyan-400/60 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
          <MapPin className="h-4 w-4 text-cyan-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="City, state, or 'remote'..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-100 font-semibold placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        {/* Country Selector */}
        <div className="w-full md:w-56">
          <CountrySelector
            value={country || 'all'}
            onChange={(code) => setCountry(code === 'all' ? '' : code)}
            allowAll={true}
            allLabel="Worldwide"
            placeholder="Country..."
            size="sm"
          />
        </div>

        {/* Search CTA */}
        <Button
          type="submit"
          variant="primary"
          className="w-full md:w-auto px-7 py-3 font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/25 cursor-pointer rounded-xl"
        >
          <span>Search</span>
          <ArrowRight className="h-4 w-4 stroke-[2.5]" />
        </Button>
      </div>
    </form>
  );
};

export default JobSearch;
