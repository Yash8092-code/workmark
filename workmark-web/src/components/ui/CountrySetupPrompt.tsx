import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { CountrySelector } from './CountrySelector';
import { Button } from './Button';
import { useAuth } from '../../hooks/useAuth';

interface CountrySetupPromptProps {
  onSaved?: (countryCode: string) => void;
  className?: string;
}

export const CountrySetupPrompt: React.FC<CountrySetupPromptProps> = ({
  onSaved,
  className = '',
}) => {
  const { user, updateCountry } = useAuth();
  const [selectedCode, setSelectedCode] = useState<string>('');
  const [selectedName, setSelectedName] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // If user already has a countryCode, don't show the prompt
  if (user?.countryCode || savedSuccess) {
    return null;
  }

  const handleSave = async () => {
    if (!selectedCode) return;
    setIsSaving(true);
    try {
      await updateCountry(selectedCode, selectedName);
      setSavedSuccess(true);
      if (onSaved) onSaved(selectedCode);
    } catch (err) {
      // toast error is handled inside updateCountry
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      data-surface="light"
      className={`surface-light relative overflow-hidden rounded-2xl border border-[#2563EB]/20 bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-sky-50/80 p-6 md:p-8 shadow-sm ${className}`}
    >
      {/* Decorative background glow */}
      <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#2563EB]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Personalize Your Experience</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[#0F172A] tracking-tight">
            Where are you looking for opportunities?
          </h2>
          <p className="mt-1.5 text-sm text-[#475569] leading-relaxed">
            Select your preferred country to unlock tailored recommendations, local market salary data, and prioritized job feeds. You can switch between your country and worldwide anytime.
          </p>
        </div>

        <div className="w-full md:w-80 flex flex-col gap-3 flex-shrink-0">
          <CountrySelector
            value={selectedCode}
            onChange={(code, name) => {
              setSelectedCode(code);
              setSelectedName(name);
            }}
            placeholder="Choose your target country..."
            size="md"
          />
          <Button
            onClick={handleSave}
            disabled={!selectedCode || isSaving}
            loading={isSaving}
            className="w-full justify-center shadow-md shadow-[#2563EB]/20 rounded-xl"
          >
            <span>Personalize My Feed</span>
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
