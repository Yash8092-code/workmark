import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, Loader2 } from 'lucide-react';
import { useCreateCompany } from '../../hooks/useCompanies';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';

const companySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  description: z.string().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  foundedYear: z.coerce.number().min(1800).max(new Date().getFullYear()).optional().or(z.literal('')),
  location: z.string().optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type CompanyFormData = z.infer<typeof companySchema>;

const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Retail',
  'Manufacturing',
  'Real Estate',
  'Marketing',
  'Consulting',
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

const CreateCompanyPage = () => {
  const navigate = useNavigate();
  const createCompanyMutation = useCreateCompany();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: CompanyFormData) => {
    try {
      // In a real app, you'd upload images to Cloudinary first
      // For now, we'll include the base64 data
      const formData = {
        ...data,
        logo: logoPreview,
        coverImage: coverPreview,
      };

      await createCompanyMutation.mutateAsync(formData as any);
      navigate('/employer/dashboard');
    } catch (error) {
      console.error('Error creating company:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#172033]">Create Company</h1>
        <p className="text-[#64748B] mt-2">Set up your company profile</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Logo Upload */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-[#172033] mb-4">Company Logo</h2>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-lg bg-[#F8FAFC] border-2 border-[#E2E8F0] overflow-hidden flex items-center justify-center">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
              ) : (
                <Upload className="w-8 h-8 text-[#64748B]" />
              )}
            </div>
            <div>
              <input
                type="file"
                id="logo"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
              <label htmlFor="logo">
                <Button type="button" variant="outline" size="sm" as="span">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Logo
                </Button>
              </label>
              <p className="text-sm text-[#64748B] mt-2">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>
        </Card>

        {/* Cover Image Upload */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-[#172033] mb-4">Cover Image</h2>
          <div className="space-y-4">
            <div className="w-full h-48 rounded-lg bg-[#F8FAFC] border-2 border-[#E2E8F0] overflow-hidden flex items-center justify-center">
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Upload className="w-8 h-8 text-[#64748B]" />
              )}
            </div>
            <div>
              <input
                type="file"
                id="cover"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
              <label htmlFor="cover">
                <Button type="button" variant="outline" size="sm" as="span">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Cover Image
                </Button>
              </label>
              <p className="text-sm text-[#64748B] mt-2">
                Recommended size: 1200x300px. JPG or PNG. Max 5MB.
              </p>
            </div>
          </div>
        </Card>

        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-[#172033] mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#172033] mb-2">
                Company Name *
              </label>
              <Input {...register('name')} placeholder="e.g., Acme Corporation" error={errors.name?.message} />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#172033] mb-2">Description</label>
              <Textarea
                {...register('description')}
                rows={5}
                placeholder="Tell us about your company..."
                error={errors.description?.message}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#172033] mb-2">Industry</label>
                <Select {...register('industry')} error={errors.industry?.message}>
                  <option value="">Select industry</option>
                  {INDUSTRIES.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#172033] mb-2">
                  Company Size
                </label>
                <Select {...register('size')} error={errors.size?.message}>
                  <option value="">Select size</option>
                  {COMPANY_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size} employees
                    </option>
                  ))}
                </Select>
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
                <label className="block text-sm font-medium text-[#172033] mb-2">
                  Founded Year
                </label>
                <Input
                  type="number"
                  {...register('foundedYear')}
                  placeholder="e.g., 2020"
                  error={errors.foundedYear?.message}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#172033] mb-2">Website</label>
                <Input
                  {...register('website')}
                  placeholder="https://www.example.com"
                  error={errors.website?.message}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button type="submit" disabled={createCompanyMutation.isPending} className="flex-1">
            {createCompanyMutation.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Create Company
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/employer/dashboard')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCompanyPage;
