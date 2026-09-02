import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, GraduationCap, FileText, ExternalLink } from 'lucide-react';
import { useApplication, useUpdateApplicationStatus } from '../../hooks/useApplications';
import type { ApplicationStatus } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const statusOptions: ApplicationStatus[] = ['applied', 'under_review', 'shortlisted', 'interview', 'selected', 'rejected'];

export default function CandidateDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: application, isLoading } = useApplication(id);
  const updateStatus = useUpdateApplicationStatus();
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | ''>('');

  const handleStatusUpdate = async () => {
    if (!selectedStatus) return;
    await updateStatus.mutateAsync({ id: id!, status: selectedStatus });
    setSelectedStatus('');
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">Loading...</div>;
  }

  if (!application) {
    return <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">Application not found</div>;
  }

  const profile = (typeof application.profileId === 'object' ? application.profileId : null) as any;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#64748B] hover:text-[#172033] mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="bg-white rounded-lg border border-[#E2E8F0] p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#0F2747]">{application.userId.name}</h1>
              <p className="text-[#64748B] mt-1">Applied for: {application.jobId.title}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as ApplicationStatus)}
                className="px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                <option value="">Update Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ')}
                  </option>
                ))}
              </select>
              <Button
                onClick={handleStatusUpdate}
                disabled={!selectedStatus}
                isLoading={updateStatus.isPending}
                variant="primary"
              >
                Update
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-[#64748B]">
              <Mail className="w-5 h-5" />
              <span>{application.userId.email}</span>
            </div>
            {profile?.phone && (
              <div className="flex items-center gap-2 text-[#64748B]">
                <Phone className="w-5 h-5" />
                <span>{profile.phone}</span>
              </div>
            )}
            {profile?.location && (
              <div className="flex items-center gap-2 text-[#64748B]">
                <MapPin className="w-5 h-5" />
                <span>{profile.location}</span>
              </div>
            )}
          </div>

          {application.coverLetter && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#172033] mb-2">Cover Letter</h2>
              <p className="text-[#64748B] whitespace-pre-wrap">{application.coverLetter}</p>
            </div>
          )}

          {application.resume && (
            <div className="mb-6">
              <a
                href={application.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#2563EB] hover:text-[#1D4ED8]"
              >
                <FileText className="w-5 h-5" />
                View Resume
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {profile?.skills && profile.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#172033] mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: string) => (
                  <Badge key={skill} variant="default">{skill}</Badge>
                ))}
              </div>
            </div>
          )}

          {profile?.experience && profile.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#172033] mb-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Experience
              </h2>
              <div className="space-y-4">
                {profile.experience.map((exp: any, idx: number) => (
                  <div key={idx} className="border-l-2 border-[#2563EB] pl-4">
                    <h3 className="font-semibold text-[#172033]">{exp.title}</h3>
                    <p className="text-[#64748B]">{exp.company}</p>
                    <p className="text-sm text-[#64748B]">
                      {new Date(exp.startDate).toLocaleDateString()} - {exp.current ? 'Present' : new Date(exp.endDate!).toLocaleDateString()}
                    </p>
                    {exp.description && <p className="text-[#64748B] mt-2">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile?.education && profile.education.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-[#172033] mb-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Education
              </h2>
              <div className="space-y-4">
                {profile.education.map((edu: any, idx: number) => (
                  <div key={idx} className="border-l-2 border-[#16A34A] pl-4">
                    <h3 className="font-semibold text-[#172033]">{edu.degree}</h3>
                    <p className="text-[#64748B]">{edu.institution}</p>
                    <p className="text-sm text-[#64748B]">
                      {new Date(edu.startDate).toLocaleDateString()} - {edu.current ? 'Present' : new Date(edu.endDate!).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
