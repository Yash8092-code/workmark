import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Plus, X } from 'lucide-react';
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
  salaryMin: z.string().min(1, 'Minimum salary is required'),
  salaryMax: z.string().min(1, 'Maximum salary is required'),
  salaryCurrency: z.string().default('INR'),
  salaryPeriod: z.string().default('year'),
  description: z.string().min(100, 'Description must be at least 100 characters'),
  openings: z.string().min(1, 'Number of openings is required'),
  deadline: z.string().optional(),
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
      toast.error('Create a company profile before posting a job');
      return;
    }

    const { salaryMin, salaryMax, salaryCurrency, salaryPeriod, openings, deadline, ...jobFields } = data;

    try {
      await createJob.mutateAsync({
        ...jobFields,
        companyId: company._id,
        skills,
        responsibilities,
        requirements,
        benefits,
        salary: {
          min: parseInt(data.salaryMin),
          max: parseInt(data.salaryMax),
          currency: data.salaryCurrency,
          period: data.salaryPeriod,
        },
        openings: parseInt(data.openings),
        deadline: data.deadline || undefined,
        status: isDraft ? 'draft' : 'active',
      });
      toast.success(isDraft ? 'Job saved as draft!' : 'Job published successfully!');
      navigate('/employer/jobs');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create job');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/employer/jobs')}
          className="flex items-center gap-2 text-[#64748B] hover:text-[#172033] mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Jobs
        </button>

        <div className="bg-white rounded-lg border border-[#E2E8F0] p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-[#0F2747] mb-6">Post a New Job</h1>

          <form className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#172033]">Basic Information</h2>

              <Input
                label="Job Title"
                {...register('title')}
                error={errors.title?.message}
                placeholder="Senior Full Stack Developer"
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
                  <option value="">Select Type</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                </Select>

                <Select
                  label="Experience Level"
                  {...register('experienceLevel')}
                  error={errors.experienceLevel?.message}
                >
                  <option value="">Select Level</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                </Select>

                <Select label="Work Mode" {...register('workMode')} error={errors.workMode?.message}>
                  <option value="">Select Mode</option>
                  <option value="onsite">On-site</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="remote">Remote</option>
                </Select>
              </div>

              <Input
                label="Location"
                {...register('location')}
                error={errors.location?.message}
                placeholder="Kolkata, India"
              />
            </div>

            {/* Salary */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#172033]">Salary Range</h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Input
                  label="Minimum"
                  {...register('salaryMin')}
                  error={errors.salaryMin?.message}
                  placeholder="800000"
                  type="number"
                />

                <Input
                  label="Maximum"
                  {...register('salaryMax')}
                  error={errors.salaryMax?.message}
                  placeholder="1400000"
                  type="number"
                />

                <Select label="Currency" {...register('salaryCurrency')}>
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                </Select>

                <Select label="Period" {...register('salaryPeriod')}>
                  <option value="yearly">Per Year</option>
                  <option value="month">Per Month</option>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#172033]">Job Description</h2>

              <Textarea
                label="Description"
                {...register('description')}
                error={errors.description?.message}
                placeholder="Describe the role, team, and what the candidate will be working on..."
                rows={6}
              />
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#172033]">Required Skills</h2>

              <div className="flex gap-2">
                <Input
                  label=""
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Add a skill (e.g., React, Node.js)"
                />
                <Button type="button" variant="outline" onClick={addSkill} className="mt-0">
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="default" className="flex items-center gap-1">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Responsibilities */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#172033]">Responsibilities</h2>

              <div className="flex gap-2">
                <Input
                  label=""
                  value={responsibilityInput}
                  onChange={(e) => setResponsibilityInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(responsibilities, setResponsibilities, responsibilityInput, setResponsibilityInput))}
                  placeholder="Add a responsibility"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addItem(responsibilities, setResponsibilities, responsibilityInput, setResponsibilityInput)}
                  className="mt-0"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              <ul className="space-y-2">
                {responsibilities.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-[#172033]">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" />
                    <span className="flex-1">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeItem(responsibilities, setResponsibilities, item)}
                      className="text-[#DC2626] hover:text-[#991B1B]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#172033]">Requirements</h2>

              <div className="flex gap-2">
                <Input
                  label=""
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(requirements, setRequirements, requirementInput, setRequirementInput))}
                  placeholder="Add a requirement"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addItem(requirements, setRequirements, requirementInput, setRequirementInput)}
                  className="mt-0"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              <ul className="space-y-2">
                {requirements.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-[#172033]">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" />
                    <span className="flex-1">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeItem(requirements, setRequirements, item)}
                      className="text-[#DC2626] hover:text-[#991B1B]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#172033]">Benefits</h2>

              <div className="flex gap-2">
                <Input
                  label=""
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(benefits, setBenefits, benefitInput, setBenefitInput))}
                  placeholder="Add a benefit"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addItem(benefits, setBenefits, benefitInput, setBenefitInput)}
                  className="mt-0"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              <ul className="space-y-2">
                {benefits.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-[#172033]">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#16A34A] flex-shrink-0" />
                    <span className="flex-1">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeItem(benefits, setBenefits, item)}
                      className="text-[#DC2626] hover:text-[#991B1B]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#172033]">Additional Information</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Number of Openings"
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

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="button"
                variant="primary"
                onClick={handleSubmit((data) => onSubmit(data, false))}
                loading={createJob.isPending || companyLoading}
                disabled={!company}
                className="flex-1"
              >
                Publish Job
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleSubmit((data) => onSubmit(data, true))}
                loading={createJob.isPending || companyLoading}
                disabled={!company}
                className="flex-1"
              >
                Save as Draft
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/employer/jobs')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
