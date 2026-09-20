import { MapPin, Edit, Mail, Phone } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import type { Profile, User } from '../../types';
import { getCountryDisplayName, getCountryFlag } from '../../utils/countries';

interface ProfileHeaderProps {
  user: User;
  profile: Profile;
  onEdit?: () => void;
  canEdit?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, profile, onEdit, canEdit = false }) => {
  const avatarSrc = user?.avatar || profile?.avatar || profile?.avatarUrl;
  const countryFlag = getCountryFlag(user?.countryCode);
  const countryName = getCountryDisplayName(user?.countryCode);

  return (
    <div className="genz-card overflow-hidden border border-white/10">
      {/* Dark Tech Gradient Banner */}
      <div className="h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 relative" />
      <div className="px-6 sm:px-8 pb-6 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 mb-4 gap-4">
          <div className="relative">
            <Avatar src={avatarSrc} name={user.name} size="xl" className="border-4 border-[#0E1526] shadow-2xl" />
          </div>
          {canEdit && (
            <Button variant="primary" onClick={onEdit} className="shadow-lg genz-btn-primary">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{user.name}</h1>
            {profile.headline ? (
              <p className="text-base font-bold text-cyan-400 mt-0.5">{profile.headline}</p>
            ) : (
              <p className="text-sm font-semibold text-slate-400 italic mt-0.5">No professional headline configured.</p>
            )}
          </div>
          {user?.countryCode && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs font-black text-cyan-300 self-start">
              <span>{countryFlag}</span>
              <span>{countryName}</span>
            </div>
          )}
        </div>

        {/* Contact Badges */}
        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-semibold text-slate-300 my-3">
          <span className="flex items-center gap-1.5">
            <Mail className="h-4 w-4 text-cyan-400" />
            <span>{user.email}</span>
          </span>
          {profile.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-cyan-400" />
              <span>{profile.phone}</span>
            </span>
          )}
          {profile.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-cyan-400" />
              <span>{profile.location}</span>
            </span>
          )}
        </div>

        {profile.bio && (
          <p className="text-sm text-slate-200 font-medium leading-relaxed mt-3 pt-3 border-t border-white/10 whitespace-pre-line">
            {profile.bio}
          </p>
        )}
      </div>
    </div>
  );
};
