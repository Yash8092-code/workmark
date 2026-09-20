import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Globe, MapPin, Calendar, Sparkles, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateCompany } from '../../hooks/useCompanies';
import * as companiesApi from '../../api/companies';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { ClayUpload } from '../../components/ui/ClayUpload';

const companySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  description: z.string().optional().or(z.literal('')),
  industry: z.string().optional().or(z.literal('')),
  size: z.string().optional().or(z.literal('')),
  foundedYear: z.preprocess(
    (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
    z.number().min(1800, 'Year must be after 1800').max(new Date().getFullYear(), 'Year cannot be in the future').optional()
  ),
  location: z.string().optional().or(z.literal('')),
  website: z.preprocess(
    (val) => (val === '' || val === undefined || val === null ? undefined : String(val)),
    z.string().url('Must be a valid URL (e.g. https://example.com)').optional()
  ),
});

type CompanyFormValues = z.infer<typeof companySchema>;

const INDUSTRIES = [
  'Technology',
  'Finance & FinTech',
  'Healthcare & Biotech',
  'Education & EdTech',
  'Retail & E-commerce',
  'Manufacturing & Robotics',
  'Real Estate & PropTech',
  'Marketing & Media',
  'Consulting & Professional Services',
  'Other',
];

const COMPANY_SIZES = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1000+',
];

export const CreateCompanyPage = () => {
  const navigate = useNavigate();
  const createCompanyMutation = useCreateCompany();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema) as any,
  });

  const onFormError = (formErrors: any) => {
    console.error('Company form validation errors:', formErrors);
    toast.error('Please check required fields in company details');
  };

  const onSubmit = async (data: CompanyFormValues) => {
    try {
      setIsUploading(true);
      const payload: any = {
        name: data.name.trim(),
        description: data.description || '',
        industry: data.industry || 'Technology',
        size: data.size || '1-10',
        companySize: data.size || '1-10',
        foundedYear: data.foundedYear ? Number(data.foundedYear) : undefined,
        location: data.location || '',
        website: data.website || undefined,
      };

      const company = await createCompanyMutation.mutateAsync(payload);

      if (company?._id) {
        if (logoFile) {
          try {
            await companiesApi.uploadLogo(company._id, logoFile);
          } catch (uploadErr) {
            console.error('Failed to upload logo', uploadErr);
          }
        }
        if (coverFile) {
          try {
            await companiesApi.uploadCover(company._id, coverFile);
          } catch (uploadErr) {
            console.error('Failed to upload cover', uploadErr);
          }
        }
      }

      navigate('/employer/company');
    } catch (error: any) {
      console.error('Error creating company:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to create company');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate('/employer/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6F6D82] hover:text-[#6C5CE7] mb-3 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#6C5CE7] flex items-center justify-center shadow-xs">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#25243A] tracking-tight">
              Create Organization Profile
            </h1>
            <p className="text-xs sm:text-sm text-[#6F6D82] mt-0.5">
              Set up your employer profile to brand your job listings and start hiring.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(((d: any) => onSubmit(d)) as any, onFormError)} className="space-y-8">
        {/* Brand Imagery Section */}
        <Card variant="raised" className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#F1F0F7]">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#6C5CE7]" />
              <h2 className="text-lg font-black text-[#25243A]">Brand Assets & Imagery</h2>
            </div>
            <span className="text-xs font-bold text-[#6F6D82]">PNG, JPG, WebP</span>
          </div>

          <div className="space-y-6">
            <ClayUpload
              id="logo"
              type="logo"
              label="Company Logo"
              description="Displayed across all your published job listings."
              onFileSelect={(file) => setLogoFile(file)}
              onRemove={() => setLogoFile(null)}
            />

            <ClayUpload
              id="cover"
              type="cover"
              label="Organization Header Banner"
              description="Hero banner shown on your company profile."
              onFileSelect={(file) => setCoverFile(file)}
              onRemove={() => setCoverFile(null)}
            />
          </div>
        </Card>

        {/* Basic Information */}
        <Card variant="raised" className="p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-[#F1F0F7]">
            <h2 className="text-lg font-black text-[#25243A]">Organization Snapshot</h2>
            <p className="text-xs text-[#6F6D82]">Tell candidates about your mission and team.</p>
          </div>

          <div className="space-y-5">
            <div>
              <Input
                label="Company / Organization Name *"
                {...register('name')}
                placeholder="e.g. Acme Innovations"
                error={errors.name?.message}
              />
            </div>

            <div>
              <Textarea
                label="About the Organization"
                {...register('description')}
                rows={5}
                placeholder="Share your team's mission, values, and work culture..."
                error={errors.description?.message}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Select
                  label="Industry Sector"
                  {...register('industry')}
                  error={errors.industry?.message}
                >
                  <option value="">Select industry</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Select
                  label="Company Size"
                  {...register('size')}
                  error={errors.size?.message}
                >
                  <option value="">Select team size</option>
                  {COMPANY_SIZES.map((sz) => (
                    <option key={sz} value={sz}>
                      {sz} employees
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Input
                  label="Location"
                  icon={<MapPin className="h-4 w-4" />}
                  {...register('location')}
                  placeholder="e.g. San Francisco, CA"
                  error={errors.location?.message}
                />
              </div>

              <div>
                <Input
                  label="Founded Year"
                  type="number"
                  icon={<Calendar className="h-4 w-4" />}
                  {...register('foundedYear')}
                  placeholder="e.g. 2021"
                  error={errors.foundedYear?.message}
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Website"
                  type="url"
                  icon={<Globe className="h-4 w-4" />}
                  {...register('website')}
                  placeholder="https://example.com"
                  error={errors.website?.message}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={createCompanyMutation.isPending || isUploading || isSubmitting}
            loading={createCompanyMutation.isPending || isUploading || isSubmitting}
            className="w-full sm:flex-1 justify-center shadow-lg"
          >
            Create Company Profile
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => navigate('/employer/dashboard')}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCompanyPage;
