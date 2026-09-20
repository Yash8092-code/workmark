import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Plus, X, Briefcase, DollarSign, ListChecks, Award, Sparkles } from 'lucide-react';
import { useJob, useUpdateJob } from '../../hooks/useJobs';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

const jobSchema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters'),
  category: z.string().min(1, 'Category is required'),
  employmentType: z.string().min(1, 'Employment type is required'),
  experienceLevel: z.string().min(1, 'Experience level is required'),
  workMode: z.string().min(1, 'Work mode is required'),
  location: z.string().min(1, 'Location is required'),
  salaryMin: z.string().optional().or(z.literal('')),
  salaryMax: z.string().optional().or(z.literal('')),
  salaryCurrency: z.string().default('INR'),
  salaryPeriod: z.string().default('yearly'),
  description: z.string().min(30, 'Description must be at least 30 characters'),
  openings: z.string().default('1'),
  deadline: z.string().optional().or(z.literal('')),
});

type JobFormData = z.infer<typeof jobSchema>;

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: job, isLoading: jobLoading } = useJob(id);
  const updateJob = useUpdateJob(id!);

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [responsibilityInput, setResponsibilityInput] = useState('');
  const [requirements, setRequirements] = useState<string[]>([]);
  const [requirementInput, setRequirementInput] = useState('');
  const [benefits, setBenefits] = useState<string[]>([]);
  const [benefitInput, setBenefitInput] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema) as any,
  });

  useEffect(() => {
    if (job) {
      const rawJob = job as any;
      reset({
        title: rawJob.title || '',
        category: rawJob.category || '',
        employmentType: rawJob.employmentType || 'full-time',
        experienceLevel: rawJob.experienceLevel || 'mid',
        workMode: rawJob.workMode || 'remote',
        location: rawJob.location || '',
        salaryMin: (rawJob.salary?.min ?? rawJob.salaryMin)?.toString() || '',
        salaryMax: (rawJob.salary?.max ?? rawJob.salaryMax)?.toString() || '',
        salaryCurrency: rawJob.salary?.currency || rawJob.salaryCurrency || 'INR',
        salaryPeriod: rawJob.salary?.period || 'yearly',
        description: rawJob.description || '',
        openings: (rawJob.openings || 1).toString(),
        deadline: rawJob.deadline ? String(rawJob.deadline).split('T')[0] : (rawJob.applicationDeadline?.split('T')[0] || ''),
      });
      setSkills(rawJob.skills || []);
      setResponsibilities(rawJob.responsibilities || []);
      setRequirements(rawJob.requirements || []);
      setBenefits(rawJob.benefits || []);
    }
  }, [job, reset]);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const addItem = (list: string[], setList: (items: string[]) => void, input: string, setInput: (val: string) => void) => {
    if (input.trim()) {
      setList([...list, input.trim()]);
      setInput('');
    }
  };

  const removeItem = (list: string[], setList: (items: string[]) => void, item: string) => {
    setList(list.filter((i) => i !== item));
  };

  const onSubmit = async (data: JobFormData) => {
    try {
      const minVal = data.salaryMin && data.salaryMin.trim() ? parseInt(data.salaryMin) : undefined;
      const maxVal = data.salaryMax && data.salaryMax.trim() ? parseInt(data.salaryMax) : undefined;
      const salaryObj = (minVal !== undefined || maxVal !== undefined)
        ? {
            min: minVal,
            max: maxVal,
            currency: data.salaryCurrency || 'INR',
            period: data.salaryPeriod === 'year' ? 'yearly' : data.salaryPeriod === 'month' ? 'monthly' : (data.salaryPeriod || 'yearly'),
          }
        : undefined;

      await updateJob.mutateAsync({
        title: data.title,
        category: data.category,
        employmentType: data.employmentType as any,
        experienceLevel: data.experienceLevel as any,
        workMode: data.workMode as any,
        location: data.location,
        description: data.description,
        skills,
        responsibilities,
        requirements,
        benefits,
        ...(salaryObj ? { salary: salaryObj } : {}),
        openings: data.openings ? parseInt(data.openings) : 1,
        deadline: data.deadline || undefined,
      } as any);
      navigate('/employer/jobs');
    } catch (error: any) {
      console.error('Error updating job:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to update job');
    }
  };

  const onFormError = (formErrors: any) => {
    console.error('Job form validation errors:', formErrors);
    const firstError = Object.values(formErrors)[0] as any;
    toast.error(firstError?.message || 'Please check required fields in your job form');
  };

  if (jobLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="text-sm font-bold text-[#7E7C9A] mt-4">Loading job details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Back button */}
      <button
        onClick={() => navigate('/employer/jobs')}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold text-[#7E7C9A] hover:text-[#25243A] hover:bg-[#E6E8F2]/60 transition-all mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Jobs Hub
      </button>

      {/* Main Container */}
      <div className="clay-card p-6 sm:p-8 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EDE9FE] text-[#6C5CE7] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Active Role Revision
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#25243A]">Edit Job Details</h1>
          <p className="text-sm font-medium text-[#7E7C9A] mt-1">
            Update role specifications, requirements, and candidate expectations.
          </p>
        </div>

        <form onSubmit={handleSubmit(((d: any) => onSubmit(d)) as any, onFormError)} className="space-y-8">
          {/* Basic Information */}
          <div className="clay-card-soft p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-[#6C5CE7] font-black text-sm uppercase tracking-wider">
              <Briefcase className="w-4 h-4" />
              Role Essentials
            </div>

            <Input label="Job Title" {...register('title')} error={errors.title?.message} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label="Category" {...register('category')} error={errors.category?.message}>
                <option value="">Select Category</option>
                <option value="Software Development">Software Development</option>
                <option value="Data Science">Data Science</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Product Management">Product Management</option>
                <option value="Operations">Operations</option>
              </Select>

              <Select label="Employment Type" {...register('employmentType')} error={errors.employmentType?.message}>
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </Select>

              <Select label="Experience Level" {...register('experienceLevel')} error={errors.experienceLevel?.message}>
                <option value="entry">Entry Level / Graduate</option>
                <option value="mid">Mid Level (1-3 yrs)</option>
                <option value="senior">Senior (3-6 yrs)</option>
                <option value="lead">Lead / Principal (6+ yrs)</option>
              </Select>

              <Select label="Work Mode" {...register('workMode')} error={errors.workMode?.message}>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-Site</option>
              </Select>
            </div>

            <Input label="Location" {...register('location')} error={errors.location?.message} />
          </div>

          {/* Salary */}
          <div className="clay-card-soft p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-[#6C5CE7] font-black text-sm uppercase tracking-wider">
              <DollarSign className="w-4 h-4" />
              Compensation Structure
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Input label="Min Salary" {...register('salaryMin')} error={errors.salaryMin?.message} type="number" />
              <Input label="Max Salary" {...register('salaryMax')} error={errors.salaryMax?.message} type="number" />
              <Select label="Currency" {...register('salaryCurrency')}>
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </Select>
              <Select label="Frequency" {...register('salaryPeriod')}>
                <option value="yearly">Per Year</option>
                <option value="monthly">Per Month</option>
                <option value="hourly">Per Hour</option>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="clay-card-soft p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-[#6C5CE7] font-black text-sm uppercase tracking-wider">
              <ListChecks className="w-4 h-4" />
              Detailed Description
            </div>
            <Textarea label="Role Overview" {...register('description')} error={errors.description?.message} rows={6} />
          </div>

          {/* Skills */}
          <div className="clay-card-soft p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-[#6C5CE7] font-black text-sm uppercase tracking-wider">
              <Award className="w-4 h-4" />
              Key Skills & Tech Stack
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  label=""
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Type a skill and press Enter"
                />
              </div>
              <Button type="button" variant="secondary" onClick={addSkill} className="mt-0">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="primary" className="flex items-center gap-1.5 py-1 px-3">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Responsibilities */}
          <div className="clay-card-soft p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-black text-[#25243A] uppercase tracking-wider">Key Responsibilities</h3>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  label=""
                  value={responsibilityInput}
                  onChange={(e) => setResponsibilityInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === 'Enter' &&
                    (e.preventDefault(),
                    addItem(responsibilities, setResponsibilities, responsibilityInput, setResponsibilityInput))
                  }
                  placeholder="Add a core responsibility..."
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => addItem(responsibilities, setResponsibilities, responsibilityInput, setResponsibilityInput)}
                className="mt-0"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>

            <ul className="space-y-2 pt-2">
              {responsibilities.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 shadow-sm border border-white/10 text-sm text-white font-medium"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#6C5CE7]" />
                    {item}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(responsibilities, setResponsibilities, item)}
                    className="text-[#FF6B81] hover:text-[#DC2626] p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div className="clay-card-soft p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-black text-[#25243A] uppercase tracking-wider">Qualifications & Requirements</h3>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  label=""
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === 'Enter' &&
                    (e.preventDefault(),
                    addItem(requirements, setRequirements, requirementInput, setRequirementInput))
                  }
                  placeholder="Add a qualification..."
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => addItem(requirements, setRequirements, requirementInput, setRequirementInput)}
                className="mt-0"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>

            <ul className="space-y-2 pt-2">
              {requirements.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 shadow-sm border border-white/10 text-sm text-white font-medium"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#35C98A]" />
                    {item}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(requirements, setRequirements, item)}
                    className="text-[#FF6B81] hover:text-[#DC2626] p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="clay-card-soft p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-black text-[#25243A] uppercase tracking-wider">Perks & Benefits</h3>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  label=""
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === 'Enter' &&
                    (e.preventDefault(),
                    addItem(benefits, setBenefits, benefitInput, setBenefitInput))
                  }
                  placeholder="Add a perk or benefit..."
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => addItem(benefits, setBenefits, benefitInput, setBenefitInput)}
                className="mt-0"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>

            <ul className="space-y-2 pt-2">
              {benefits.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 shadow-sm border border-white/10 text-sm text-white font-medium"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8ED8FF]" />
                    {item}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(benefits, setBenefits, item)}
                    className="text-[#FF6B81] hover:text-[#DC2626] p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Openings & Deadlines */}
          <div className="clay-card-soft p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-black text-[#25243A] uppercase tracking-wider">Openings & Deadlines</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Number of Positions"
                {...register('openings')}
                error={errors.openings?.message}
                placeholder="1"
                type="number"
              />

              <Input
                label="Application Deadline (Optional)"
                {...register('deadline')}
                error={errors.deadline?.message}
                type="date"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-[#E6E8F2]">
            <Button type="submit" variant="primary" loading={updateJob.isPending} className="flex-1">
              Save & Update Posting
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate('/employer/jobs')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
