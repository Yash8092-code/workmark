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
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/20'
            : isOpen
            ? 'border-[#2563EB] ring-4 ring-[#2563EB]/10 bg-white shadow-sm'
            : 'border-[#E2E8F0] hover:border-[#CBD5E1] bg-white'
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-[#F8FAFC]' : 'cursor-pointer'}`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {isAllSelected ? (
            <>
              <span className="text-lg leading-none">🌎</span>
              <span className="font-medium text-[#0F172A]">{allLabel}</span>
            </>
          ) : selectedCountry ? (
            <>
              <span className="text-lg leading-none shadow-xs">{selectedCountry.flag}</span>
              <span className="font-medium text-[#0F172A] truncate">{selectedCountry.name}</span>
              <span className="text-xs uppercase font-semibold text-[#94A3B8] bg-[#F1F5F9] px-1.5 py-0.5 rounded">
                {selectedCountry.code}
              </span>
            </>
          ) : (
            <>
              <Globe className="h-4 w-4 text-[#94A3B8]" />
              <span className="text-[#94A3B8]">{placeholder}</span>
            </>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-[#64748B] transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180 text-[#2563EB]' : ''
          }`}
        />
      </button>

      {supportingText && !error && (
        <p className="mt-1.5 text-xs text-[#64748B] leading-relaxed">{supportingText}</p>
      )}
      {error && <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>}

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl bg-white border border-[#E2E8F0] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {/* Search box inside dropdown */}
          <div className="p-2.5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-3.5 w-3.5 text-[#94A3B8]" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(0);
                }}
                placeholder="Search country or code..."
                className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-lg border border-[#E2E8F0] bg-white focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 placeholder:text-[#94A3B8]"
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
              <li className="px-3 py-6 text-center text-xs text-[#64748B]">
                No country found matching "<span className="font-medium text-[#0F172A]">{searchQuery}</span>"
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
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm cursor-pointer transition-colors duration-100 ${
                      isSelected
                        ? 'bg-[#2563EB]/10 text-[#2563EB] font-medium'
                        : isHighlighted
                        ? 'bg-[#F1F5F9] text-[#0F172A]'
                        : 'text-[#334155]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-lg leading-none">{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                      {c.code !== 'all' && (
                        <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">
                          {c.code}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4 text-[#2563EB] flex-shrink-0 ml-2" />
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
