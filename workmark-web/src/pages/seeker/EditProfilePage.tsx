import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, ArrowLeft, X, Sparkles, User, Briefcase, GraduationCap, Folder, FileText } from 'lucide-react';
import { useProfile, useUpdateProfile, useUploadResume, useUploadAvatar } from '../../hooks/useProfile';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { ClayUpload } from '../../components/ui/ClayUpload';
import { EmailPreferencesCard } from '../../components/profile/EmailPreferencesCard';
import { CountryPreferencesCard } from '../../components/profile/CountryPreferencesCard';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  headline: z.string().optional().or(z.literal('')),
  bio: z.string().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  skills: z.array(z.string()).default([]),
  experience: z
    .array(
      z.object({
        title: z.string().optional().or(z.literal('')),
        company: z.string().optional().or(z.literal('')),
        location: z.string().optional().or(z.literal('')),
        startDate: z.string().optional().or(z.literal('')),
        endDate: z.string().optional().or(z.literal('')),
        current: z.boolean().default(false),
        description: z.string().optional().or(z.literal('')),
      })
    )
    .default([]),
  education: z
    .array(
      z.object({
        degree: z.string().optional().or(z.literal('')),
        institution: z.string().optional().or(z.literal('')),
        fieldOfStudy: z.string().optional().or(z.literal('')),
        startDate: z.string().optional().or(z.literal('')),
        endDate: z.string().optional().or(z.literal('')),
        current: z.boolean().default(false),
        description: z.string().optional().or(z.literal('')),
      })
    )
    .default([]),
  projects: z
    .array(
      z.object({
        title: z.string().optional().or(z.literal('')),
        description: z.string().optional().or(z.literal('')),
        url: z.string().optional().or(z.literal('')),
        technologies: z.array(z.string()).default([]),
        startDate: z.string().optional().or(z.literal('')),
        endDate: z.string().optional().or(z.literal('')),
      })
    )
    .default([]),
  socialLinks: z
    .object({
      linkedin: z.string().optional().or(z.literal('')),
      github: z.string().optional().or(z.literal('')),
      portfolio: z.string().optional().or(z.literal('')),
      twitter: z.string().optional().or(z.literal('')),
    })
    .default({}),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const uploadResumeMutation = useUploadResume();
  const uploadAvatarMutation = useUploadAvatar();

  const [skillInput, setSkillInput] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      headline: '',
      bio: '',
      location: '',
      phone: '',
      skills: [],
      experience: [],
      education: [],
      projects: [],
      socialLinks: {},
    },
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: 'experience',
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: 'education',
  });

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({
    control,
    name: 'projects',
  });

  const skills = watch('skills') || [];

  useEffect(() => {
    if (profile) {
      setValue('headline', profile.headline || '');
      setValue('bio', profile.bio || '');
      setValue('location', profile.location || '');
      setValue('phone', profile.phone || '');
      setValue('skills', profile.skills || []);
      setValue('experience', (profile.experience || []) as any);
      setValue('education', (profile.education || []) as any);
      setValue('projects', (profile.projects || []) as any);
      setValue('socialLinks', profile.socialLinks || {});
    }
  }, [profile, setValue]);

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setValue('skills', [...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setValue(
      'skills',
      skills.filter((s) => s !== skill)
    );
  };

  const isSubmitting =
    updateProfileMutation.isPending ||
    uploadResumeMutation.isPending ||
    uploadAvatarMutation.isPending;

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Upload avatar if changed
      if (avatarFile) {
        try {
          await uploadAvatarMutation.mutateAsync(avatarFile);
        } catch (err: any) {
          console.warn('Avatar upload failed, continuing with profile update:', err);
        }
      }

      // Upload resume if changed
      if (resumeFile) {
        try {
          await uploadResumeMutation.mutateAsync(resumeFile);
        } catch (err: any) {
          console.warn('Resume upload failed, continuing with profile update:', err);
        }
      }

      // Filter out empty rows
      const cleanedData = {
        ...data,
        experience: (data.experience || []).filter((exp: any) => exp.title || exp.company),
        education: (data.education || []).filter((edu: any) => edu.degree || edu.institution),
        projects: (data.projects || []).filter((proj: any) => proj.title || proj.description),
      };

      // Update profile
      await updateProfileMutation.mutateAsync(cleanedData as any);
      navigate('/seeker/profile');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to update profile');
    }
  };

  const onFormError = (formErrors: any) => {
    console.error('Profile form validation errors:', formErrors);
    toast.error('Please check required fields in your profile form');
  };

  if (profileLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-3">
        <Spinner size="lg" />
        <p className="text-sm font-bold text-[#7E7C9A]">Loading profile editor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Back button */}
      <button
        onClick={() => navigate('/seeker/profile')}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold text-[#7E7C9A] hover:text-[#25243A] hover:bg-[#E6E8F2]/60 transition-all mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Profile
      </button>

      {/* Main Container */}
      <div className="clay-card p-6 sm:p-8 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EDE9FE] text-[#6C5CE7] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Profile & Career Dossier
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#25243A]">Edit Seeker Profile</h1>
          <p className="text-sm font-medium text-[#7E7C9A] mt-1">
            Update your professional summary, skills, portfolio projects, and resume.
          </p>
        </div>

        <form onSubmit={handleSubmit(((d: any) => onSubmit(d)) as any, onFormError)} className="space-y-8">
          {/* Avatar Section using ClayUpload */}
          <div className="clay-card-soft p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-black text-[#25243A] uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-[#6C5CE7]" />
              Profile Photo
            </h2>
            <ClayUpload
              id="avatar"
              type="avatar"
              currentUrl={user?.avatar || profile?.avatar || profile?.avatarUrl}
              onFileSelect={(file) => setAvatarFile(file)}
              onRemove={() => setAvatarFile(null)}
              label="Upload Avatar Photo"
              description="PNG, JPG, WebP up to 5MB. Square ratio looks best."
            />
          </div>

          {/* Resume Upload using ClayUpload */}
          <div className="clay-card-soft p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-black text-[#25243A] uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#6C5CE7]" />
              Resume / CV File
            </h2>
            <ClayUpload
              id="resume"
              type="resume"
              currentUrl={profile?.resumeUrl || profile?.resume}
              onFileSelect={(file) => setResumeFile(file)}
              onRemove={() => setResumeFile(null)}
              label="Upload PDF / DOCX Resume"
              description="PDF or DOCX format up to 10MB. Automatically attached during applications."
            />
          </div>

          {/* Basic Information */}
          <div className="clay-card-soft p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-black text-[#25243A] uppercase tracking-wider">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Headline"
                {...register('headline')}
                placeholder="e.g., Senior Full Stack Developer"
                error={errors.headline?.message}
              />
              <Input
                label="Location"
                {...register('location')}
                placeholder="e.g., Bengaluru, India or Remote"
                error={errors.location?.message}
              />
              <Input
                label="Phone Number"
                {...register('phone')}
                placeholder="e.g., +91 98765 43210"
                error={errors.phone?.message}
              />
            </div>
            <Textarea
              label="Bio & Summary"
              {...register('bio')}
              rows={4}
              placeholder="Tell recruiters about your background, key strengths, and career ambitions..."
              error={errors.bio?.message}
            />
          </div>

          {/* Skills */}
          <div className="clay-card-soft p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-black text-[#25243A] uppercase tracking-wider">Key Skills</h2>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  label=""
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  placeholder="Type a skill (e.g. React, Node.js, Python) and press Enter"
                />
              </div>
              <Button type="button" variant="secondary" onClick={handleAddSkill} className="mt-0">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((skill, index) => (
                <Badge key={index} variant="primary" className="flex items-center gap-1.5 py-1 px-3">
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="clay-card-soft p-5 sm:p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-black text-[#25243A] uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#6C5CE7]" />
                Work History
              </h2>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  appendExperience({
                    title: '',
                    company: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    current: false,
                    description: '',
                  })
                }
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Experience
              </Button>
            </div>
            <div className="space-y-4">
              {experienceFields.map((field, index) => (
                <div key={field.id} className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black text-[#6C5CE7] uppercase">Position {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="text-[#FF6B81] hover:text-[#DC2626] p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <Input
                      label="Job Title *"
                      {...register(`experience.${index}.title`)}
                      error={errors.experience?.[index]?.title?.message}
                      placeholder="e.g. Lead Engineer"
                    />
                    <Input
                      label="Company *"
                      {...register(`experience.${index}.company`)}
                      error={errors.experience?.[index]?.company?.message}
                      placeholder="e.g. Stripe"
                    />
                    <Input label="Location" {...register(`experience.${index}.location`)} placeholder="e.g. Remote" />
                    <Input
                      label="Start Date *"
                      type="month"
                      {...register(`experience.${index}.startDate`)}
                      error={errors.experience?.[index]?.startDate?.message}
                    />
                    <Input
                      label="End Date"
                      type="month"
                      {...register(`experience.${index}.endDate`)}
                      disabled={watch(`experience.${index}.current`)}
                    />
                    <div className="flex items-center pt-6">
                      <input
                        type="checkbox"
                        id={`curr-exp-${index}`}
                        {...register(`experience.${index}.current`)}
                        className="w-4 h-4 text-[#6C5CE7] border-[#E6E8F2] rounded focus:ring-[#6C5CE7]"
                      />
                      <label htmlFor={`curr-exp-${index}`} className="ml-2 text-xs font-bold text-[#25243A]">
                        Currently working here
                      </label>
                    </div>
                  </div>
                  <Textarea
                    label="Description"
                    {...register(`experience.${index}.description`)}
                    rows={2}
                    placeholder="Key contributions and achievements..."
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="clay-card-soft p-5 sm:p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-black text-[#25243A] uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#35C98A]" />
                Education
              </h2>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  appendEducation({
                    degree: '',
                    institution: '',
                    fieldOfStudy: '',
                    startDate: '',
                    endDate: '',
                    current: false,
                    description: '',
                  })
                }
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Education
              </Button>
            </div>
            <div className="space-y-4">
              {educationFields.map((field, index) => (
                <div key={field.id} className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black text-[#35C98A] uppercase">Education {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="text-[#FF6B81] hover:text-[#DC2626] p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <Input
                      label="Degree *"
                      {...register(`education.${index}.degree`)}
                      error={errors.education?.[index]?.degree?.message}
                      placeholder="e.g. B.Tech Computer Science"
                    />
                    <Input
                      label="Institution *"
                      {...register(`education.${index}.institution`)}
                      error={errors.education?.[index]?.institution?.message}
                      placeholder="e.g. IIT Bombay"
                    />
                    <Input label="Field of Study" {...register(`education.${index}.fieldOfStudy`)} />
                    <Input
                      label="Start Date *"
                      type="month"
                      {...register(`education.${index}.startDate`)}
                      error={errors.education?.[index]?.startDate?.message}
                    />
                    <Input
                      label="End Date"
                      type="month"
                      {...register(`education.${index}.endDate`)}
                      disabled={watch(`education.${index}.current`)}
                    />
                    <div className="flex items-center pt-6">
                      <input
                        type="checkbox"
                        id={`curr-edu-${index}`}
                        {...register(`education.${index}.current`)}
                        className="w-4 h-4 text-[#6C5CE7] border-[#E6E8F2] rounded focus:ring-[#6C5CE7]"
                      />
                      <label htmlFor={`curr-edu-${index}`} className="ml-2 text-xs font-bold text-[#25243A]">
                        Currently studying
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="clay-card-soft p-5 sm:p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-black text-[#25243A] uppercase tracking-wider flex items-center gap-2">
                <Folder className="w-4 h-4 text-[#8ED8FF]" />
                Projects
              </h2>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  appendProject({
                    title: '',
                    description: '',
                    url: '',
                    technologies: [],
                    startDate: '',
                    endDate: '',
                  })
                }
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Project
              </Button>
            </div>
            <div className="space-y-4">
              {projectFields.map((field, index) => (
                <div key={field.id} className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black text-[#8ED8FF] uppercase">Project {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeProject(index)}
                      className="text-[#FF6B81] hover:text-[#DC2626] p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <Input
                      label="Project Title *"
                      {...register(`projects.${index}.title`)}
                      error={errors.projects?.[index]?.title?.message}
                      placeholder="e.g. Real-time Crypto Analytics"
                    />
                    <Input label="Project URL" {...register(`projects.${index}.url`)} placeholder="https://..." />
                  </div>
                  <Textarea
                    label="Description"
                    {...register(`projects.${index}.description`)}
                    rows={2}
                    error={errors.projects?.[index]?.description?.message}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="clay-card-soft p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-black text-[#25243A] uppercase tracking-wider">Social Links</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="LinkedIn URL" {...register('socialLinks.linkedin')} placeholder="https://linkedin.com/in/..." />
              <Input label="GitHub URL" {...register('socialLinks.github')} placeholder="https://github.com/..." />
              <Input label="Portfolio Website" {...register('socialLinks.portfolio')} placeholder="https://yourportfolio.com" />
              <Input label="Twitter / X" {...register('socialLinks.twitter')} placeholder="https://twitter.com/..." />
            </div>
          </div>

          {/* Target Country & Location Preferences */}
          <CountryPreferencesCard />

          {/* Email & Alert Preferences */}
          <EmailPreferencesCard />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-[#E6E8F2]">
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              className="flex-1"
            >
              Save Profile Changes
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/seeker/profile')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
