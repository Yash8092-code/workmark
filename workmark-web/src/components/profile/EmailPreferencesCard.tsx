import React, { useState, useEffect } from 'react';
import { Mail, Bell, Sparkles, Check, Globe, MapPin, Briefcase, Plus, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { getPreferences, updatePreferences } from '../../api/auth';
import toast from 'react-hot-toast';

export const EmailPreferencesCard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [emailNotifications, setEmailNotifications] = useState({
    newJobs: true,
    applicationUpdates: true,
    marketing: false,
  });

  const [jobAlertPreferences, setJobAlertPreferences] = useState({
    keywords: [] as string[],
    locations: [] as string[],
    countries: [] as string[],
    categories: [] as string[],
    employmentTypes: [] as string[],
    workModes: [] as string[],
    experienceLevels: [] as string[],
  });

  const [newKeyword, setNewKeyword] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    fetchPrefs();
  }, []);

  const fetchPrefs = async () => {
    try {
      setIsLoading(true);
      const data = await getPreferences();
      if (data.emailNotifications) {
        setEmailNotifications({
          newJobs: data.emailNotifications.newJobs ?? true,
          applicationUpdates: data.emailNotifications.applicationUpdates ?? true,
          marketing: data.emailNotifications.marketing ?? false,
        });
      }
      if (data.jobAlertPreferences) {
        setJobAlertPreferences({
          keywords: data.jobAlertPreferences.keywords || [],
          locations: data.jobAlertPreferences.locations || [],
          countries: data.jobAlertPreferences.countries || [],
          categories: data.jobAlertPreferences.categories || [],
          employmentTypes: data.jobAlertPreferences.employmentTypes || [],
          workModes: data.jobAlertPreferences.workModes || [],
          experienceLevels: data.jobAlertPreferences.experienceLevels || [],
        });
      }
    } catch (error) {
      console.error('Failed to load email preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updatePreferences({
        emailNotifications,
        jobAlertPreferences,
      });
      toast.success('Email & Job Alert preferences saved successfully!');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = (
    field: 'keywords' | 'locations' | 'countries' | 'categories',
    value: string,
    clearFn: (v: string) => void
  ) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (jobAlertPreferences[field].includes(trimmed)) {
      clearFn('');
      return;
    }
    setJobAlertPreferences((prev) => ({
      ...prev,
      [field]: [...prev[field], trimmed],
    }));
    clearFn('');
  };

  const removeTag = (field: 'keywords' | 'locations' | 'countries' | 'categories', index: number) => {
    setJobAlertPreferences((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, idx) => idx !== index),
    }));
  };

  const toggleArrayOption = (
    field: 'employmentTypes' | 'workModes' | 'experienceLevels',
    option: string
  ) => {
    setJobAlertPreferences((prev) => {
      const exists = prev[field].includes(option);
      return {
        ...prev,
        [field]: exists ? prev[field].filter((item) => item !== option) : [...prev[field], option],
      };
    });
  };

  if (isLoading) {
    return (
      <Card>
        <Card.Body className="p-6">
          <div className="flex items-center space-x-3 animate-pulse">
            <div className="h-6 w-6 bg-slate-200 rounded-full" />
            <div className="h-5 bg-slate-200 rounded w-1/3" />
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="border border-[#E2E8F0] shadow-sm">
      <Card.Body className="p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E2E8F0]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 text-[#2563EB] rounded-lg">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#172033]">Email & Job Alert Preferences</h2>
              <p className="text-xs text-[#64748B]">
                Control which transactional emails and job recommendations you receive
              </p>
            </div>
          </div>
          <Button onClick={handleSave} loading={isSaving} size="sm">
            Save Preferences
          </Button>
        </div>

        {/* Notification Subscriptions */}
        <div className="space-y-4 mb-8">
          <h3 className="text-sm font-semibold text-[#172033] uppercase tracking-wider flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#2563EB]" />
            Email Subscriptions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-start p-4 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] cursor-pointer hover:border-[#CBD5E1] transition-colors">
              <input
                type="checkbox"
                checked={emailNotifications.newJobs}
                onChange={(e) =>
                  setEmailNotifications((prev) => ({ ...prev, newJobs: e.target.checked }))
                }
                className="mt-1 h-4 w-4 rounded text-[#2563EB] focus:ring-[#2563EB] border-slate-300"
              />
              <div className="ml-3">
                <span className="text-sm font-semibold text-[#172033] block">New Job Alerts</span>
                <span className="text-xs text-[#64748B] block mt-0.5">
                  Receive personalized alerts when new matching opportunities are posted.
                </span>
              </div>
            </label>

            <label className="flex items-start p-4 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] cursor-pointer hover:border-[#CBD5E1] transition-colors">
              <input
                type="checkbox"
                checked={emailNotifications.applicationUpdates}
                onChange={(e) =>
                  setEmailNotifications((prev) => ({
                    ...prev,
                    applicationUpdates: e.target.checked,
                  }))
                }
                className="mt-1 h-4 w-4 rounded text-[#2563EB] focus:ring-[#2563EB] border-slate-300"
              />
              <div className="ml-3">
                <span className="text-sm font-semibold text-[#172033] block">Application Updates</span>
                <span className="text-xs text-[#64748B] block mt-0.5">
                  Get notified when an employer reviews, shortlists, or updates your application.
                </span>
              </div>
            </label>

            <label className="flex items-start p-4 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] cursor-pointer hover:border-[#CBD5E1] transition-colors">
              <input
                type="checkbox"
                checked={emailNotifications.marketing}
                onChange={(e) =>
                  setEmailNotifications((prev) => ({ ...prev, marketing: e.target.checked }))
                }
                className="mt-1 h-4 w-4 rounded text-[#2563EB] focus:ring-[#2563EB] border-slate-300"
              />
              <div className="ml-3">
                <span className="text-sm font-semibold text-[#172033] block">Platform News</span>
                <span className="text-xs text-[#64748B] block mt-0.5">
                  Periodic product updates, feature releases, and career tips from Workmark.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Job Alert Filters */}
        <div className="space-y-6">
          <h3 className="text-sm font-semibold text-[#172033] uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#2563EB]" />
            Job Alert Filters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Keywords */}
            <div>
              <label className="text-xs font-semibold text-[#475569] block mb-1">
                Target Keywords & Skills (e.g. React, Node.js, Product Manager)
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag('keywords', newKeyword, setNewKeyword);
                    }
                  }}
                  placeholder="Add a keyword & press enter"
                  className="text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addTag('keywords', newKeyword, setNewKeyword)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                {jobAlertPreferences.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-[#1D4ED8] border border-blue-200"
                  >
                    {kw}
                    <button
                      type="button"
                      onClick={() => removeTag('keywords', i)}
                      className="hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Countries */}
            <div>
              <label className="text-xs font-semibold text-[#475569] block mb-1">
                Preferred Countries (e.g. India, United States, Germany, Remote)
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag('countries', newCountry, setNewCountry);
                    }
                  }}
                  placeholder="Add country (e.g. India, Germany)"
                  className="text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addTag('countries', newCountry, setNewCountry)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                {jobAlertPreferences.countries.map((c, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200"
                  >
                    <Globe className="h-3 w-3" />
                    {c}
                    <button
                      type="button"
                      onClick={() => removeTag('countries', i)}
                      className="hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div>
              <label className="text-xs font-semibold text-[#475569] block mb-1">
                Locations / Cities (e.g. Bengaluru, Berlin, London, New York)
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag('locations', newLocation, setNewLocation);
                    }
                  }}
                  placeholder="Add location"
                  className="text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addTag('locations', newLocation, setNewLocation)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                {jobAlertPreferences.locations.map((loc, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                  >
                    <MapPin className="h-3 w-3" />
                    {loc}
                    <button
                      type="button"
                      onClick={() => removeTag('locations', i)}
                      className="hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="text-xs font-semibold text-[#475569] block mb-1">
                Job Categories (e.g. Engineering, Design, Marketing, Sales)
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag('categories', newCategory, setNewCategory);
                    }
                  }}
                  placeholder="Add category"
                  className="text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addTag('categories', newCategory, setNewCategory)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                {jobAlertPreferences.categories.map((cat, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200"
                  >
                    <Briefcase className="h-3 w-3" />
                    {cat}
                    <button
                      type="button"
                      onClick={() => removeTag('categories', i)}
                      className="hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Work Mode & Employment Type Checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="text-xs font-semibold text-[#475569] block mb-2">Work Modes</label>
              <div className="flex flex-wrap gap-2">
                {['remote', 'hybrid', 'onsite'].map((mode) => {
                  const selected = jobAlertPreferences.workModes.includes(mode);
                  return (
                    <button
                      type="button"
                      key={mode}
                      onClick={() => toggleArrayOption('workModes', mode)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-all ${
                        selected
                          ? 'bg-[#2563EB] text-white border-[#2563EB]'
                          : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1]'
                      }`}
                    >
                      {selected && <Check className="h-3 w-3 inline mr-1" />}
                      {mode}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#475569] block mb-2">
                Employment Types
              </label>
              <div className="flex flex-wrap gap-2">
                {['full-time', 'part-time', 'contract', 'internship', 'freelance'].map((type) => {
                  const selected = jobAlertPreferences.employmentTypes.includes(type);
                  return (
                    <button
                      type="button"
                      key={type}
                      onClick={() => toggleArrayOption('employmentTypes', type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-all ${
                        selected
                          ? 'bg-[#2563EB] text-white border-[#2563EB]'
                          : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1]'
                      }`}
                    >
                      {selected && <Check className="h-3 w-3 inline mr-1" />}
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
export default EmailPreferencesCard;
