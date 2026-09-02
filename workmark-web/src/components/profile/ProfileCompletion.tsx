import React from 'react';
import type { Profile } from '../../types';

interface ProfileCompletionProps {
  profile: Profile;
}

export const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ profile }) => {
  const calculateCompletion = () => {
    let completed = 0;
    const total = 10;

    if (profile.headline) completed++;
    if (profile.location) completed++;
    if (profile.phone) completed++;
    if (profile.bio) completed++;
    if (profile.avatar) completed++;
    if (profile.resume) completed++;
    if (profile.skills?.length > 0) completed++;
    if (profile.experience?.length > 0) completed++;
    if (profile.education?.length > 0) completed++;
    if (profile.socialLinks?.linkedin || profile.socialLinks?.github || profile.socialLinks?.portfolio) completed++;

    return Math.round((completed / total) * 100);
  };

  const completion = calculateCompletion();

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-[#172033]">Profile Completion</h3>
        <span className="text-2xl font-bold text-[#2563EB]">{completion}%</span>
      </div>
      <div className="w-full bg-[#E2E8F0] rounded-full h-2 mb-3">
        <div
          className="bg-[#2563EB] h-2 rounded-full transition-all duration-300"
          style={{ width: `${completion}%` }}
        />
      </div>
      {completion < 100 && (
        <p className="text-sm text-[#64748B]">
          Complete your profile to increase your chances of getting hired
        </p>
      )}
    </div>
  );
};
