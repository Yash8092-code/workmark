import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useJob, useUpdateJob } from '../../hooks/useJobs';
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
  salaryCurrency: z.string(),
  salaryPeriod: z.string(),
  description: z.string().min(100, 'Description must be at least 100 characters'),
  openings: z.string().min(1, 'Number of openings is required'),
  deadline: z.string().optional(),
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
  const [requirements, setRequirements] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
  });

  useEffect(() => {
    if (job) {
      reset({
        title: job.title,
        category: job.category,
        employmentType: job.employmentType,
        experienceLevel: job.experienceLevel,
        workMode: job.workMode,
        location: job.location,
        salaryMin: job.salaryMin?.toString() || '',
        salaryMax: job.salaryMax?.toString() || '',
        salaryCurrency: job.salaryCurrency || 'INR',
        salaryPeriod: 'year',
        description: job.description,
        openings: '1',
        deadline: job.applicationDeadline?.split('T')[0] || '',
      });
      setSkills(job.skills || []);
      setResponsibilities(job.responsibilities || []);
      setRequirements(job.requirements || []);
      setBenefits(job.benefits || []);
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

  const onSubmit = async (data: JobFormData) => {
    try {
      await updateJob.mutateAsync({
        ...data,
        skills,
        responsibilities,
        requirements,
        benefits,
        salaryMin: parseInt(data.salaryMin),
        salaryMax: parseInt(data.salaryMax),
      } as any);
      navigate('/employer/jobs');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update job');
    }
  };

  if (jobLoading) {
    return <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">Loading...</div>;
  }

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
          <h1 className="text-2xl font-bold text-[#0F2747] mb-6">Edit Job</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#172033]">Basic Information</h2>

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
                </Select>

                <Select label="Employment Type" {...register('employmentType')} error={errors.employmentType?.message}>
                  <option value="">Select Type</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </Select>

                <Select label="Experience Level" {...register('experienceLevel')} error={errors.experienceLevel?.message}>
                  <option value="">Select Level</option>
                  <option value="Fresher">Fresher</option>
                  <option value="Entry Level">Entry Level</option>
                  <option value="1-3 Years">1-3 Years</option>
                  <option value="3-5 Years">3-5 Years</option>
                  <option value="5+ Years">5+ Years</option>
                </Select>

                <Select label="Work Mode" {...register('workMode')} error={errors.workMode?.message}>
                  <option value="">Select Mode</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                </Select>
              </div>

              <Input label="Location" {...register('location')} error={errors.location?.message} />
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#172033]">Salary Range</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Input label="Minimum" {...register('salaryMin')} error={errors.salaryMin?.message} type="number" />
                <Input label="Maximum" {...register('salaryMax')} error={errors.salaryMax?.message} type="number" />
                <Select label="Currency" {...register('salaryCurrency')}>
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                </Select>
                <Select label="Period" {...register('salaryPeriod')}>
                  <option value="year">Per Year</option>
                  <option value="month">Per Month</option>
                </Select>
              </div>
            </div>

            <Textarea label="Description" {...register('description')} error={errors.description?.message} rows={6} />

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#172033]">Required Skills</h2>
              <div className="flex gap-2">
                <Input
                  label=""
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
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

            <div className="flex gap-4 pt-4">
              <Button type="submit" variant="primary" isLoading={updateJob.isPending} className="flex-1">
                Update Job
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/employer/jobs')}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
