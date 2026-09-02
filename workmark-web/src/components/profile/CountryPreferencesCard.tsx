import React, { useState } from 'react';
import { Globe, Check, Edit2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CountrySelector } from '../ui/CountrySelector';
import { useAuth } from '../../hooks/useAuth';
import { getCountryDisplayName, getCountryFlag } from '../../utils/countries';

export const CountryPreferencesCard: React.FC = () => {
  const { user, updateCountry } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCode, setSelectedCode] = useState(user?.countryCode || 'in');
  const [selectedName, setSelectedName] = useState(user?.countryName || 'India');
  const [isSaving, setIsSaving] = useState(false);

  const countryFlag = getCountryFlag(user?.countryCode);
  const countryDisplayName = getCountryDisplayName(user?.countryCode) || user?.countryName || 'Not configured';

  const handleSave = async () => {
    if (!selectedCode) return;
    setIsSaving(true);
    try {
      await updateCountry(selectedCode, selectedName);
      setIsEditing(false);
    } catch (error) {
      // Toast error handled in AuthContext
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border border-[#E2E8F0] shadow-xs rounded-2xl overflow-hidden">
      <Card.Body className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-blue-50 text-[#2563EB] rounded-xl flex-shrink-0">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#0F172A]">Target Country & Discovery Preference</h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Your primary country determines local job recommendations, alerts, and market benchmarks.
              </p>
            </div>
          </div>

          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCode(user?.countryCode || 'in');
                setSelectedName(user?.countryName || 'India');
                setIsEditing(true);
              }}
              className="rounded-xl flex-shrink-0"
            >
              <Edit2 className="h-3.5 w-3.5 mr-1.5" />
              <span>Change Country</span>
            </Button>
          )}
        </div>

        {!isEditing ? (
          <div className="mt-6 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl leading-none">{countryFlag}</span>
              <div>
                <span className="text-sm font-bold text-[#0F172A] block">{countryDisplayName}</span>
                <span className="text-xs text-[#64748B]">Default search prioritized to this market</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/60">
              Primary Location
            </span>
          </div>
        ) : (
          <div className="mt-6 p-5 rounded-2xl bg-[#F8FAFC] border border-[#2563EB]/20 space-y-4 animate-in fade-in duration-150">
            <CountrySelector
              label="Select New Target Country"
              supportingText="We'll update your job feed and matching criteria immediately."
              value={selectedCode}
              onChange={(code, name) => {
                setSelectedCode(code);
                setSelectedName(name);
              }}
              size="md"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
                className="rounded-xl text-[#64748B]"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                loading={isSaving}
                className="rounded-xl shadow-xs"
              >
                <Check className="h-3.5 w-3.5 mr-1.5" />
                Save Preference
              </Button>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
