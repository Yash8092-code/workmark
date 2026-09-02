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
      <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-xl shadow-slate-900/5 border border-[#E2E8F0] flex flex-col md:flex-row items-center gap-2">
        {/* Keyword Search */}
        <div className="flex-1 w-full flex items-center gap-2.5 px-3 py-1.5">
          <Search className="h-4 w-4 text-[#2563EB] flex-shrink-0" />
          <input
            type="text"
            placeholder="Job title, skills, or company..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full bg-transparent text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none"
          />
        </div>

        <div className="hidden md:block w-px h-8 bg-[#E2E8F0]" />

        {/* Location input */}
        <div className="flex-1 w-full flex items-center gap-2.5 px-3 py-1.5">
          <MapPin className="h-4 w-4 text-[#64748B] flex-shrink-0" />
          <input
            type="text"
            placeholder="City, state, or remote..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-transparent text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none"
          />
        </div>

        <div className="hidden md:block w-px h-8 bg-[#E2E8F0]" />

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
          className="w-full md:w-auto px-6 py-3 rounded-xl shadow-md shadow-[#2563EB]/25 font-bold flex items-center justify-center gap-1.5"
        >
          <span>Search</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
