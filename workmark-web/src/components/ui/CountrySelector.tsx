import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, Globe } from 'lucide-react';
import { SUPPORTED_COUNTRIES, getCountryByCode, type CountryItem } from '../../utils/countries';

export interface CountrySelectorProps {
  value?: string;
  onChange: (countryCode: string, countryName: string) => void;
  label?: string;
  supportingText?: string;
  error?: string;
  placeholder?: string;
  allowAll?: boolean;
  allLabel?: string;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onChange,
  label,
  supportingText,
  error,
  placeholder = 'Select your country...',
  allowAll = false,
  allLabel = 'Worldwide (All Countries)',
  className = '',
  disabled = false,
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedCountry = getCountryByCode(value);
  const isAllSelected = allowAll && (!value || value === 'all');

  // Filter countries by search query
  const filteredCountries: (CountryItem | { code: 'all'; name: string; flag: string; currency: string })[] = [
    ...(allowAll && !searchQuery ? [{ code: 'all' as const, name: allLabel, flag: '🌎', currency: '' }] : []),
    ...SUPPORTED_COUNTRIES.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  ];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      setHighlightedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < filteredCountries.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCountries[highlightedIndex]) {
          const item = filteredCountries[highlightedIndex];
          if (item.code === 'all') {
            onChange('all', allLabel);
          } else {
            onChange(item.code, item.name);
          }
          setIsOpen(false);
          setSearchQuery('');
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchQuery('');
        break;
    }
  };

  const sizeClasses = {
    sm: 'py-1.5 px-3 text-xs',
    md: 'py-2.5 px-3.5 text-sm',
    lg: 'py-3.5 px-4 text-base',
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef} onKeyDown={handleKeyDown}>
      {label && (
        <label className="block text-sm font-semibold text-[#0F172A] mb-1.5 flex items-center justify-between">
          <span>{label}</span>
          {selectedCountry && (
            <span className="text-xs font-normal text-[#64748B]">
              Selected: <span className="font-medium text-[#2563EB]">{selectedCountry.flag} {selectedCountry.name}</span>
            </span>
          )}
        </label>
      )}

      {/* Trigger button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between rounded-xl border transition-all duration-150 text-left ${sizeClasses[size]} ${
          error
            ? 'border-red-500/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-950/20'
            : isOpen
            ? 'border-cyan-400 ring-4 ring-cyan-500/20 bg-slate-900/90 shadow-lg'
            : 'border-white/10 hover:border-cyan-500/40 bg-slate-900/70 text-slate-100'
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-950' : 'cursor-pointer'}`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {isAllSelected ? (
            <>
              <span className="text-lg leading-none">🌎</span>
              <span className="font-medium text-slate-100">{allLabel}</span>
            </>
          ) : selectedCountry ? (
            <>
              <span className="text-lg leading-none shadow-xs">{selectedCountry.flag}</span>
              <span className="font-medium text-slate-100 truncate">{selectedCountry.name}</span>
              <span className="text-xs uppercase font-semibold text-slate-400 bg-slate-800 border border-white/5 px-1.5 py-0.5 rounded">
                {selectedCountry.code}
              </span>
            </>
          ) : (
            <>
              <Globe className="h-4 w-4 text-slate-400" />
              <span className="text-slate-400">{placeholder}</span>
            </>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180 text-cyan-400' : ''
          }`}
        />
      </button>

      {supportingText && !error && (
        <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">{supportingText}</p>
      )}
      {error && <p className="mt-1.5 text-xs text-rose-400 font-medium">{error}</p>}

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl bg-[#0D1322] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
          {/* Search box inside dropdown */}
          <div className="p-2.5 border-b border-white/10 bg-slate-950/60">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-3.5 w-3.5 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(0);
                }}
                placeholder="Search country or code..."
                className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-lg border border-white/10 bg-slate-900 text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Options list */}
          <ul
            ref={listRef}
            role="listbox"
            className="max-h-60 overflow-y-auto p-1.5 space-y-0.5"
          >
            {filteredCountries.length === 0 ? (
              <li className="px-3 py-6 text-center text-xs text-slate-400">
                No country found matching "<span className="font-medium text-slate-200">{searchQuery}</span>"
              </li>
            ) : (
              filteredCountries.map((c, index) => {
                const isSelected = c.code === 'all' ? isAllSelected : value?.toLowerCase() === c.code.toLowerCase();
                const isHighlighted = highlightedIndex === index;

                return (
                  <li
                    key={c.code}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      if (c.code === 'all') {
                        onChange('all', allLabel);
                      } else {
                        onChange(c.code, c.name);
                      }
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-500/20 text-cyan-300 font-semibold border border-blue-500/30'
                        : isHighlighted
                        ? 'bg-slate-800 text-slate-100'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-base leading-none">{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                      {c.code !== 'all' && (
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          {c.code}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4 text-cyan-400 flex-shrink-0 ml-2" />
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
