import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { SkillTags } from '../../components/profile/SkillTags';
import { Spinner } from '../../components/ui/Spinner';
import { Card } from '../../components/ui/Card';
import { Briefcase, GraduationCap, Folder, Link as LinkIcon, FileText } from 'lucide-react';
import { format } from 'date-fns';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile();

  if (isLoading || !user || !profile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ProfileHeader
          user={user}
          profile={profile}
          canEdit={true}
          onEdit={() => navigate('/profile/edit')}
        />

        {/* Skills */}
        {profile.skills?.length > 0 && (
          <Card>
            <Card.Body>
              <h2 className="text-xl font-semibold text-[#172033] mb-4">Skills</h2>
              <SkillTags skills={profile.skills} />
            </Card.Body>
          </Card>
        )}

        {/* Experience */}
        {profile.experience?.length > 0 && (
          <Card>
            <Card.Body>
              <h2 className="text-xl font-semibold text-[#172033] mb-6 flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Experience
              </h2>
              <div className="space-y-6">
                {profile.experience.map((exp, index) => (
                  <div key={exp._id || index} className="border-l-2 border-[#E2E8F0] pl-4">
                    <h3 className="font-semibold text-[#172033]">{exp.title}</h3>
                    <p className="text-[#2563EB] mb-1">{exp.company}</p>
                    <p className="text-sm text-[#64748B] mb-2">
                      {format(new Date(exp.startDate), 'MMM yyyy')} -{' '}
                      {exp.current ? 'Present' : format(new Date(exp.endDate!), 'MMM yyyy')}
                      {exp.location && ` • ${exp.location}`}
                    </p>
                    {exp.description && (
                      <p className="text-[#64748B] whitespace-pre-line">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Education */}
        {profile.education?.length > 0 && (
          <Card>
            <Card.Body>
              <h2 className="text-xl font-semibold text-[#172033] mb-6 flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                Education
              </h2>
              <div className="space-y-6">
                {profile.education.map((edu, index) => (
                  <div key={edu._id || index} className="border-l-2 border-[#E2E8F0] pl-4">
                    <h3 className="font-semibold text-[#172033]">{edu.degree}</h3>
                    <p className="text-[#2563EB] mb-1">{edu.institution}</p>
                    <p className="text-sm text-[#64748B] mb-2">
                      {format(new Date(edu.startDate), 'MMM yyyy')} -{' '}
                      {edu.current ? 'Present' : format(new Date(edu.endDate!), 'MMM yyyy')}
                      {edu.fieldOfStudy && ` • ${edu.fieldOfStudy}`}
                    </p>
                    {edu.description && (
                      <p className="text-[#64748B] whitespace-pre-line">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Projects */}
        {profile.projects.length > 0 && (
          <Card>
            <Card.Body>
              <h2 className="text-xl font-semibold text-[#172033] mb-6 flex items-center">
                <Folder className="h-5 w-5 mr-2" />
                Projects
              </h2>
              <div className="space-y-6">
                {profile.projects.map((project, index) => (
                  <div key={project._id || index}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-[#172033]">{project.title}</h3>
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#2563EB] hover:text-[#1d4ed8]"
                        >
                          <LinkIcon className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-[#64748B] mb-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-[#F8FAFC] text-[#64748B] text-xs rounded-md border border-[#E2E8F0]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Resume */}
        {profile.resume && (
          <Card>
            <Card.Body>
              <h2 className="text-xl font-semibold text-[#172033] mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Resume
              </h2>
              <a
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2563EB] hover:text-[#1d4ed8] flex items-center"
              >
                <FileText className="h-4 w-4 mr-2" />
                View Resume
              </a>
            </Card.Body>
          </Card>
        )}

        {/* Social Links */}
        {(profile.socialLinks?.linkedin ||
          profile.socialLinks?.github ||
          profile.socialLinks?.portfolio ||
          profile.socialLinks?.twitter) && (
          <Card>
            <Card.Body>
              <h2 className="text-xl font-semibold text-[#172033] mb-4">Social Links</h2>
              <div className="space-y-2">
                {profile.socialLinks?.linkedin && (
                  <a
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2563EB] hover:text-[#1d4ed8] flex items-center"
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    LinkedIn
                  </a>
                )}
                {profile.socialLinks?.github && (
                  <a
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2563EB] hover:text-[#1d4ed8] flex items-center"
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    GitHub
                  </a>
                )}
                {profile.socialLinks?.portfolio && (
                  <a
                    href={profile.socialLinks.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2563EB] hover:text-[#1d4ed8] flex items-center"
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Portfolio
                  </a>
                )}
                {profile.socialLinks?.twitter && (
                  <a
                    href={profile.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2563EB] hover:text-[#1d4ed8] flex items-center"
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Twitter
                  </a>
                )}
              </div>
            </Card.Body>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};
