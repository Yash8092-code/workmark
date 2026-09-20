import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Plus, X, Briefcase, DollarSign, ListChecks, Award, Sparkles, Building } from 'lucide-react';
import { useCreateJob } from '../../hooks/useJobs';
import { useMyCompany } from '../../hooks/useCompanies';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
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

export default function CreateJobPage() {
  const navigate = useNavigate();
  const createJob = useCreateJob();
  const { data: company, isLoading: companyLoading } = useMyCompany();

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
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema) as any,
    defaultValues: {
      salaryCurrency: 'INR',
      salaryPeriod: 'yearly',
      openings: '1',
      workMode: 'remote',
      employmentType: 'full-time',
      experienceLevel: 'mid',
    },
  });

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

  const onSubmit = async (data: JobFormData, isDraft: boolean = false) => {
    if (!company) {
      toast.error('Please create a company profile first before posting jobs');
      navigate('/employer/company/create');
      return;
    }

    const { salaryMin, salaryMax, salaryCurrency, salaryPeriod, openings, deadline, ...jobFields } = data;

    try {
      const minVal = salaryMin && salaryMin.trim() ? parseInt(salaryMin) : undefined;
      const maxVal = salaryMax && salaryMax.trim() ? parseInt(salaryMax) : undefined;
      const salaryObj = (minVal !== undefined || maxVal !== undefined)
        ? {
            min: minVal,
            max: maxVal,
            currency: salaryCurrency || 'INR',
            period: salaryPeriod === 'year' ? 'yearly' : salaryPeriod === 'month' ? 'monthly' : (salaryPeriod || 'yearly'),
          }
        : undefined;

      await createJob.mutateAsync({
        ...jobFields,
        companyId: company._id,
        skills,
        responsibilities,
        requirements,
        benefits,
        ...(salaryObj ? { salary: salaryObj } : {}),
        openings: openings ? parseInt(openings) : 1,
        deadline: deadline || undefined,
        status: isDraft ? 'draft' : 'active',
      });
      navigate('/employer/jobs');
    } catch (error: any) {
      console.error('Error creating job:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to create job');
    }
  };

  const onFormError = (formErrors: any) => {
    console.error('Job form validation errors:', formErrors);
    const firstError = Object.values(formErrors)[0] as any;
    toast.error(firstError?.message || 'Please check required fields in your job form');
  };

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

      {!company && !companyLoading && (
        <div className="clay-card p-6 mb-8 border-l-4 border-l-[#FFB84D] bg-[#FFFBEB]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFB84D]/20 flex items-center justify-center flex-shrink-0">
                <Building className="w-5 h-5 text-[#B45309]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#92400E]">Company Profile Required</h3>
                <p className="text-xs text-[#B45309] mt-0.5">
                  You must set up your verified employer profile before publishing openings.
                </p>
              </div>
            </div>
            <Button size="sm" variant="primary" onClick={() => navigate('/employer/company/create')}>
              Create Profile Now
            </Button>
          </div>
        </div>
      )}

      {/* Main Form Container */}
      <div className="clay-card p-6 sm:p-8 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EDE9FE] text-[#6C5CE7] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            New Recruitment Campaign
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#25243A]">Post a New Opening</h1>
          <p className="text-sm font-medium text-[#7E7C9A] mt-1">
            Specify candidate requirements, compensation, and workflow parameters.
          </p>
        </div>

        <form className="space-y-8">
          {/* Section: Basic Information */}
          <div className="clay-card-soft p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-[#6C5CE7] font-black text-sm uppercase tracking-wider">
              <Briefcase className="w-4 h-4" />
              Role Essentials
            </div>

            <Input
              label="Job Title"
              {...register('title')}
              error={errors.title?.message}
              placeholder="e.g. Senior Full Stack Engineer"
            />

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

              <Select
                label="Employment Type"
                {...register('employmentType')}
                error={errors.employmentType?.message}
              >
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </Select>

              <Select
                label="Experience Level"
                {...register('experienceLevel')}
                error={errors.experienceLevel?.message}
              >
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

            <Input
              label="Location"
              {...register('location')}
              error={errors.location?.message}
              placeholder="e.g. Bengaluru, India or Remote"
            />
          </div>

          {/* Section: Compensation */}
          <div className="clay-card-soft p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-[#6C5CE7] font-black text-sm uppercase tracking-wider">
              <DollarSign className="w-4 h-4" />
              Compensation Structure
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Input
                label="Min Salary"
                {...register('salaryMin')}
                error={errors.salaryMin?.message}
                placeholder="e.g. 1200000"
                type="number"
              />

              <Input
                label="Max Salary"
                {...register('salaryMax')}
                error={errors.salaryMax?.message}
                placeholder="e.g. 1800000"
                type="number"
              />

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

          {/* Section: Job Description */}
          <div className="clay-card-soft p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-[#6C5CE7] font-black text-sm uppercase tracking-wider">
              <ListChecks className="w-4 h-4" />
              Detailed Description
            </div>

            <Textarea
              label="Role Overview & Objectives"
              {...register('description')}
              error={errors.description?.message}
              placeholder="Describe the day-to-day mission, team culture, growth opportunities, and tech stack in detail..."
              rows={6}
            />
          </div>

          {/* Section: Skills & Competencies */}
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
                  placeholder="Type a skill (e.g., React, TypeScript, GraphQL) and press Enter"
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
              {skills.length === 0 && (
                <span className="text-xs font-semibold text-[#7E7C9A]">No skills added yet.</span>
              )}
            </div>
          </div>

          {/* Section: Responsibilities */}
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

          {/* Section: Requirements */}
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
                  placeholder="Add a qualification / prerequisite..."
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

          {/* Section: Benefits */}
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
                  placeholder="e.g. Health Insurance, Home Office Budget, Wellness Stipend"
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

          {/* Section: Openings & Deadlines */}
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

          {/* In-Flight Guarded Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-[#E6E8F2]">
            <Button
              type="button"
              variant="primary"
              onClick={handleSubmit((data) => onSubmit(data, false), onFormError)}
              loading={createJob.isPending || companyLoading}
              className="flex-1"
            >
              Publish Active Opening
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleSubmit((data) => onSubmit(data, true), onFormError)}
              loading={createJob.isPending || companyLoading}
              className="flex-1"
            >
              Save as Draft
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/employer/jobs')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
