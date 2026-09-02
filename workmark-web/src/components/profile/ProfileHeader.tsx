import React from 'react';
import { MapPin, Edit } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import type { Profile, User } from '../../types';

interface ProfileHeaderProps {
  user: User;
  profile: Profile;
  onEdit?: () => void;
  canEdit?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, profile, onEdit, canEdit = false }) => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-[#0F2747] to-[#2563EB]" />
      <div className="px-6 pb-6">
        <div className="flex items-end justify-between -mt-16 mb-4">
          <Avatar src={profile.avatar} name={user.name} size="xl" className="border-4 border-white" />
          {canEdit && (
            <Button variant="outline" onClick={onEdit} className="mb-2">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        <h1 className="text-2xl font-bold text-[#172033] mb-1">{user.name}</h1>
        {profile.headline && (
          <p className="text-lg text-[#64748B] mb-3">{profile.headline}</p>
        )}
        {profile.location && (
          <p className="text-[#64748B] flex items-center mb-4">
            <MapPin className="h-4 w-4 mr-2" />
            {profile.location}
          </p>
        )}

        {profile.bio && (
          <p className="text-[#64748B] leading-relaxed">{profile.bio}</p>
        )}
      </div>
    </div>
  );
};
