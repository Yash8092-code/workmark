import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Briefcase, GraduationCap, Folder, Link as LinkIcon, FileText, Sparkles, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

const formatSafeDate = (dateVal?: string | Date | null, formatStr = 'MMM yyyy'): string => {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return '';
  try {
    return format(d, formatStr);
  } catch {
    return '';
  }
};

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile();

  if (isLoading || !user || !profile) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Spinner size="lg" />
          <p className="text-sm font-bold text-[#7E7C9A]">Loading profile details...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fadeIn">
        <ProfileHeader
          user={user}
          profile={profile}
          canEdit={true}
          onEdit={() => navigate('/seeker/profile/edit')}
        />

        {/* Skills */}
        {profile.skills?.length > 0 && (
          <div className="clay-card p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4 text-[#6C5CE7] font-black text-sm uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Verified Competencies & Skills
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <Badge key={index} variant="primary" className="text-sm py-1 px-3">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {profile.experience?.length > 0 && (
          <div className="clay-card p-6 sm:p-8">
            <h2 className="text-lg font-black text-[#25243A] mb-6 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-[#6C5CE7]" />
              Work History
            </h2>
            <div className="space-y-6">
              {profile.experience.map((exp, index) => {
                const startStr = formatSafeDate(exp.startDate);
                const endStr = exp.current ? 'Present' : formatSafeDate(exp.endDate);
                const dateRange = [startStr, endStr].filter(Boolean).join(' - ');

                return (
                  <div key={exp._id || index} className="clay-card-soft p-5 border-l-4 border-l-[#6C5CE7]">
                    <h3 className="font-black text-base text-[#25243A]">{exp.title}</h3>
                    <p className="text-sm font-bold text-[#6C5CE7] mb-1">{exp.company}</p>
                    {dateRange && (
                      <p className="text-xs font-semibold text-[#7E7C9A] mb-2">
                        {dateRange}
                        {exp.location && ` • ${exp.location}`}
                      </p>
                    )}
                    {exp.description && (
                      <p className="text-sm font-medium text-[#25243A] whitespace-pre-line mt-2 pt-2 border-t border-[#E6E8F2]">
                        {exp.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Education */}
        {profile.education?.length > 0 && (
          <div className="clay-card p-6 sm:p-8">
            <h2 className="text-lg font-black text-[#25243A] mb-6 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-[#6C5CE7]" />
              Education & Degrees
            </h2>
            <div className="space-y-6">
              {profile.education.map((edu, index) => {
                const startStr = formatSafeDate(edu.startDate);
                const endStr = edu.current ? 'Present' : formatSafeDate(edu.endDate);
                const dateRange = [startStr, endStr].filter(Boolean).join(' - ');

                return (
                  <div key={edu._id || index} className="clay-card-soft p-5 border-l-4 border-l-[#35C98A]">
                    <h3 className="font-black text-base text-[#25243A]">{edu.degree}</h3>
                    <p className="text-sm font-bold text-[#35C98A] mb-1">{edu.institution}</p>
                    {dateRange && (
                      <p className="text-xs font-semibold text-[#7E7C9A] mb-2">
                        {dateRange}
                        {edu.fieldOfStudy && ` • ${edu.fieldOfStudy}`}
                      </p>
                    )}
                    {edu.description && (
                      <p className="text-sm font-medium text-[#25243A] whitespace-pre-line mt-2 pt-2 border-t border-[#E6E8F2]">
                        {edu.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Projects */}
        {profile.projects?.length > 0 && (
          <div className="clay-card p-6 sm:p-8">
            <h2 className="text-lg font-black text-[#25243A] mb-6 flex items-center gap-2">
              <Folder className="h-5 w-5 text-[#6C5CE7]" />
              Portfolio Projects
            </h2>
            <div className="space-y-6">
              {profile.projects.map((project, index) => (
                <div key={project._id || index} className="clay-card-soft p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-black text-base text-[#25243A]">{project.title}</h3>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#6C5CE7] hover:underline"
                      >
                        <span>Visit Project</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                  <p className="text-sm font-medium text-[#7E7C9A] mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2.5 py-1 bg-slate-900/80 text-slate-200 font-semibold text-xs rounded-lg border border-white/10 shadow-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resume */}
        <div className="clay-card p-6 sm:p-8">
          <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-400" />
            Resume / CV Dossier
          </h2>
          {profile.resumeUrl || profile.resume ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 shadow-sm border border-indigo-500/30">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-white">Verified Resume Attached</p>
                  <p className="text-xs font-semibold text-slate-400">Available for employers during application reviews</p>
                </div>
              </div>
              <a
                href={profile.resumeUrl || profile.resume}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary" size="sm" className="genz-btn-primary">
                  <ExternalLink className="w-4 h-4 mr-1.5" />
                  View Resume
                </Button>
              </a>
            </div>
          ) : (
            <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/10 text-center">
              <p className="text-xs font-semibold text-slate-400 mb-3">No resume attached to your profile yet.</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/seeker/profile/edit')}
                className="bg-slate-800 text-slate-200 border-white/10 hover:bg-slate-700"
              >
                Upload Resume in Edit Profile
              </Button>
            </div>
          )}
        </div>

        {/* Social Links */}
        {(profile.socialLinks?.linkedin ||
          profile.socialLinks?.github ||
          profile.socialLinks?.portfolio ||
          profile.socialLinks?.twitter) && (
          <div className="clay-card p-6 sm:p-8">
            <h2 className="text-lg font-black text-white mb-4">Professional & Social Profiles</h2>
            <div className="flex flex-wrap gap-3">
              {profile.socialLinks?.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-cyan-300 text-xs font-bold rounded-xl border border-white/10 hover:border-cyan-500/30 shadow-xs transition-all"
                >
                  <LinkIcon className="h-3.5 w-3.5 text-cyan-400" />
                  LinkedIn
                </a>
              )}
              {profile.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-cyan-300 text-xs font-bold rounded-xl border border-white/10 hover:border-cyan-500/30 shadow-xs transition-all"
                >
                  <LinkIcon className="h-3.5 w-3.5 text-cyan-400" />
                  GitHub
                </a>
              )}
              {profile.socialLinks?.portfolio && (
                <a
                  href={profile.socialLinks.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-cyan-300 text-xs font-bold rounded-xl border border-white/10 hover:border-cyan-500/30 shadow-xs transition-all"
                >
                  <LinkIcon className="h-3.5 w-3.5 text-cyan-400" />
                  Portfolio
                </a>
              )}
              {profile.socialLinks?.twitter && (
                <a
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-cyan-300 text-xs font-bold rounded-xl border border-white/10 hover:border-cyan-500/30 shadow-xs transition-all"
                >
                  <LinkIcon className="h-3.5 w-3.5 text-cyan-400" />
                  Twitter
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
