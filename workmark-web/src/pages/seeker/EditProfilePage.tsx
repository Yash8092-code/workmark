import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Upload, X, Loader2 } from 'lucide-react';
import { useProfile, useUpdateProfile, useUploadResume, useUploadAvatar } from '../../hooks/useProfile';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { EmailPreferencesCard } from '../../components/profile/EmailPreferencesCard';
import { CountryPreferencesCard } from '../../components/profile/CountryPreferencesCard';

const profileSchema = z.object({
  headline: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  skills: z.array(z.string()),
  experience: z.array(
    z.object({
      title: z.string().min(1, 'Title is required'),
      company: z.string().min(1, 'Company is required'),
      location: z.string().optional(),
      startDate: z.string().min(1, 'Start date is required'),
      endDate: z.string().optional(),
      current: z.boolean(),
      description: z.string().optional(),
    })
  ),
  education: z.array(
    z.object({
      degree: z.string().min(1, 'Degree is required'),
      institution: z.string().min(1, 'Institution is required'),
      fieldOfStudy: z.string().optional(),
      startDate: z.string().min(1, 'Start date is required'),
      endDate: z.string().optional(),
      current: z.boolean(),
      description: z.string().optional(),
    })
  ),
  projects: z.array(
    z.object({
      title: z.string().min(1, 'Title is required'),
      description: z.string().min(1, 'Description is required'),
      url: z.string().optional(),
      technologies: z.array(z.string()),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    })
  ),
  socialLinks: z.object({
    linkedin: z.string().optional(),
    github: z.string().optional(),
    portfolio: z.string().optional(),
    twitter: z.string().optional(),
  }),
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
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
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

  const skills = watch('skills');

  useEffect(() => {
    if (profile) {
      setValue('headline', profile.headline || '');
      setValue('bio', profile.bio || '');
      setValue('location', profile.location || '');
      setValue('phone', profile.phone || '');
      setValue('skills', profile.skills || []);
      setValue('experience', profile.experience || []);
      setValue('education', profile.education || []);
      setValue('projects', profile.projects || []);
      setValue('socialLinks', profile.socialLinks || {});
      if (profile.avatar) {
        setAvatarPreview(profile.avatar);
      }
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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Upload avatar if changed
      if (avatarFile) {
        await uploadAvatarMutation.mutateAsync(avatarFile);
      }

      // Upload resume if changed
      if (resumeFile) {
        await uploadResumeMutation.mutateAsync(resumeFile);
      }

      // Update profile
      await updateProfileMutation.mutateAsync(data);
      navigate('/seeker/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#172033]">Edit Profile</h1>
        <p className="text-[#64748B] mt-2">Update your profile information</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-[#172033] mb-4">Profile Picture</h2>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-[#F8FAFC] border-2 border-[#E2E8F0] overflow-hidden flex items-center justify-center">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl text-[#64748B]">{user?.name?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <label htmlFor="avatar">
                <Button type="button" variant="outline" size="sm" as="span">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
              </label>
              <p className="text-sm text-[#64748B] mt-2">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>
        </Card>

        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-[#172033] mb-4">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#172033] mb-2">Headline</label>
              <Input
                {...register('headline')}
                placeholder="e.g., Senior Full Stack Developer"
                error={errors.headline?.message}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#172033] mb-2">Location</label>
              <Input
                {...register('location')}
                placeholder="e.g., San Francisco, CA"
                error={errors.location?.message}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#172033] mb-2">Phone</label>
              <Input
                {...register('phone')}
                placeholder="e.g., +1 234 567 8900"
                error={errors.phone?.message}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-[#172033] mb-2">Bio</label>
            <Textarea
              {...register('bio')}
              rows={4}
              placeholder="Tell us about yourself..."
              error={errors.bio?.message}
            />
          </div>
        </Card>

        {/* Skills */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-[#172033] mb-4">Skills</h2>
          <div className="flex gap-2 mb-4">
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
              placeholder="Add a skill (e.g., React, Node.js)"
            />
            <Button type="button" onClick={handleAddSkill}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-[#2563EB] text-white rounded-full text-sm"
              >
                {skill}
                <button type="button" onClick={() => handleRemoveSkill(skill)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </Card>

        {/* Experience */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#172033]">Experience</h2>
            <Button
              type="button"
              variant="outline"
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
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </div>
          <div className="space-y-6">
            {experienceFields.map((field, index) => (
              <div key={field.id} className="border border-[#E2E8F0] rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-[#172033]">Experience {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#172033] mb-2">
                      Job Title *
                    </label>
                    <Input
                      {...register(`experience.${index}.title`)}
                      error={errors.experience?.[index]?.title?.message}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#172033] mb-2">
                      Company *
                    </label>
                    <Input
                      {...register(`experience.${index}.company`)}
                      error={errors.experience?.[index]?.company?.message}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#172033] mb-2">
                      Location
                    </label>
                    <Input {...register(`experience.${index}.location`)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#172033] mb-2">
                      Start Date *
                    </label>
                    <Input
                      type="month"
                      {...register(`experience.${index}.startDate`)}
                      error={errors.experience?.[index]?.startDate?.message}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#172033] mb-2">
                      End Date
                    </label>
                    <Input
                      type="month"
                      {...register(`experience.${index}.endDate`)}
                      disabled={watch(`experience.${index}.current`)}
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register(`experience.${index}.current`)}
                      className="w-4 h-4 text-[#2563EB] border-[#E2E8F0] rounded focus:ring-[#2563EB]"
                    />
                    <label className="ml-2 text-sm text-[#172033]">Currently working here</label>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-[#172033] mb-2">
                    Description
                  </label>
                  <Textarea {...register(`experience.${index}.description`)} rows={3} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Education */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#172033]">Education</h2>
            <Button
              type="button"
              variant="outline"
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
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          </div>
          <div className="space-y-6">
            {educationFields.map((field, index) => (
              <div key={field.id} className="border border-[#E2E8F0] rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-[#172033]">Education {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#172033] mb-2">
                      Degree *
                    </label>
                    <Input
                      {...register(`education.${index}.degree`)}
                      error={errors.education?.[index]?.degree?.message}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#172033] mb-2">
                      Institution *
                    </label>
                    <Input
                      {...register(`education.${index}.institution`)}
                      error={errors.education?.[index]?.institution?.message}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#172033] mb-2">
                      Field of Study
                    </label>
                    <Input {...register(`education.${index}.fieldOfStudy`)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#172033] mb-2">
                      Start Date *
                    </label>
                    <Input
                      type="month"
                      {...register(`education.${index}.startDate`)}
                      error={errors.education?.[index]?.startDate?.message}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#172033] mb-2">
                      End Date
                    </label>
                    <Input
                      type="month"
                      {...register(`education.${index}.endDate`)}
                      disabled={watch(`education.${index}.current`)}
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register(`education.${index}.current`)}
                      className="w-4 h-4 text-[#2563EB] border-[#E2E8F0] rounded focus:ring-[#2563EB]"
                    />
                    <label className="ml-2 text-sm text-[#172033]">Currently studying</label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Projects */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#172033]">Projects</h2>
            <Button
              type="button"
              variant="outline"
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
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </div>
          <div className="space-y-6">
            {projectFields.map((field, index) => (
              <div key={field.id} className="border border-[#E2E8F0] rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-[#172033]">Project {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeProject(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#172033] mb-2">
                      Project Title *
                    </label>
                    <Input
                      {...register(`projects.${index}.title`)}
                      error={errors.projects?.[index]?.title?.message}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#172033] mb-2">URL</label>
                    <Input {...register(`projects.${index}.url`)} placeholder="https://..." />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-[#172033] mb-2">
                    Description *
                  </label>
                  <Textarea
                    {...register(`projects.${index}.description`)}
                    rows={3}
                    error={errors.projects?.[index]?.description?.message}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Resume Upload */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-[#172033] mb-4">Resume</h2>
          <div>
            <input
              type="file"
              id="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              className="hidden"
            />
            <label htmlFor="resume">
              <Button type="button" variant="outline" as="span">
                <Upload className="w-4 h-4 mr-2" />
                {resumeFile ? resumeFile.name : 'Upload Resume'}
              </Button>
            </label>
            {profile?.resume && !resumeFile && (
              <p className="text-sm text-[#64748B] mt-2">Current resume uploaded</p>
            )}
            <p className="text-sm text-[#64748B] mt-2">PDF, DOC, or DOCX. Max 5MB.</p>
          </div>
        </Card>

        {/* Social Links */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-[#172033] mb-4">Social Links</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#172033] mb-2">LinkedIn</label>
              <Input
                {...register('socialLinks.linkedin')}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#172033] mb-2">GitHub</label>
              <Input {...register('socialLinks.github')} placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#172033] mb-2">Portfolio</label>
              <Input
                {...register('socialLinks.portfolio')}
                placeholder="https://yourwebsite.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#172033] mb-2">Twitter</label>
              <Input {...register('socialLinks.twitter')} placeholder="https://twitter.com/..." />
            </div>
          </div>
        </Card>

        {/* Target Country & Location Preferences */}
        <CountryPreferencesCard />

        {/* Email & Alert Preferences */}
        <EmailPreferencesCard />

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={updateProfileMutation.isPending || uploadResumeMutation.isPending || uploadAvatarMutation.isPending}
            className="flex-1"
          >
            {(updateProfileMutation.isPending || uploadResumeMutation.isPending || uploadAvatarMutation.isPending) && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Save Changes
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/seeker/profile')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
