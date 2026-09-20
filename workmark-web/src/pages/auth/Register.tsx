import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { CountrySelector } from '../../components/ui/CountrySelector';
import {
  Sparkles,
  ArrowRight,
  User,
  Mail,
  Phone,
  AtSign,
  Lock,
  Layers,
  CheckCircle2,
  Plus,
  X,
  ShieldCheck,
  Building2,
} from 'lucide-react';

const DEFAULT_DOMAINS = [
  'Software Engineer',
  'Full Stack Developer',
  'Machine Learning Engg',
  'Frontend Developer',
  'Backend Developer',
  'DevOps & Cloud',
  'Data Scientist',
  'Mobile App Developer',
  'UI/UX Designer',
  'Product Manager',
  'Cybersecurity',
  'AI / Data Engineer',
];

const registerSchema = z
  .object({
    role: z.enum(['job_seeker', 'employer']),
    name: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    mobileNumber: z
      .string()
      .min(6, 'Mobile number is required (at least 6 digits)')
      .regex(/^[+0-9\s\-()]+$/, 'Enter a valid mobile phone number'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username cannot exceed 30 characters')
      .regex(
        /^[a-zA-Z0-9_.-]+$/,
        'Username can only contain letters, numbers, underscores, dots, and hyphens'
      ),
    companyName: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    countryCode: z.string().min(2, 'Please select your target country / location'),
    countryName: z.string().optional(),
    domains: z.array(z.string()).min(1, 'Please select at least one domain / track'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .refine((data) => data.role !== 'employer' || (!!data.companyName && data.companyName.trim().length >= 2), {
    message: 'Company name is required for employer registration',
    path: ['companyName'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [customDomainInput, setCustomDomainInput] = useState('');

  const initialRole = searchParams.get('role') === 'employer' ? 'employer' : 'job_seeker';
  const [activeRole, setActiveRole] = useState<'job_seeker' | 'employer'>(initialRole);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema) as any,
    defaultValues: {
      role: initialRole,
      name: '',
      email: '',
      mobileNumber: '',
      username: '',
      companyName: '',
      password: '',
      confirmPassword: '',
      countryCode: '',
      countryName: '',
      domains: ['Full Stack Developer'],
    },
  });

  useEffect(() => {
    setValue('role', activeRole);
  }, [activeRole, setValue]);

  const selectedDomains = watch('domains') || [];

  const toggleDomain = (domain: string) => {
    if (selectedDomains.includes(domain)) {
      if (selectedDomains.length > 1) {
        setValue(
          'domains',
          selectedDomains.filter((d) => d !== domain),
          { shouldValidate: true }
        );
      }
    } else {
      setValue('domains', [...selectedDomains, domain], { shouldValidate: true });
    }
  };

  const handleAddCustomDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customDomainInput.trim();
    if (trimmed && !selectedDomains.includes(trimmed)) {
      setValue('domains', [...selectedDomains, trimmed], { shouldValidate: true });
      setCustomDomainInput('');
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await registerUser({
        name: data.name,
        email: data.email,
        mobileNumber: data.mobileNumber,
        username: data.username,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: activeRole,
        companyName: activeRole === 'employer' ? data.companyName : undefined,
        countryCode: data.countryCode,
        countryName: data.countryName,
        domains: data.domains,
      });

      // No OTP verification required - immediately navigate to appropriate dashboard
      navigate(response.user.role === 'employer' ? '/employer/dashboard' : '/seeker/dashboard');
    } catch (error) {
      // Error handled by AuthContext toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden bg-[#090D16]">
      {/* Ambient background glows (takeuforward style) */}
      <div className="absolute top-10 -left-28 w-[500px] h-[500px] bg-[#327CF6]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 -right-28 w-[500px] h-[500px] bg-[#8B5CF6]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#38BDF8]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header Badge & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-cyan-400 border border-cyan-500/20 mb-4 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="tracking-wide">Instant Onboarding • Zero Email Verification Hassle</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            New User <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">Application</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-2 max-w-lg mx-auto">
            Set up your identity and target domains to unlock curated jobs and direct opportunities worldwide.
          </p>
        </div>

        {/* Form Container */}
        <div className="genz-card p-6 sm:p-10 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
          {/* Role Switcher Pill */}
          <div className="flex items-center p-1.5 bg-slate-950/80 rounded-2xl border border-white/10 mb-8">
            <button
              type="button"
              onClick={() => setActiveRole('job_seeker')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeRole === 'job_seeker'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <User className="h-4 w-4" />
              <span>Candidate / Job Seeker</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveRole('employer')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeRole === 'employer'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <Building2 className="h-4 w-4 text-purple-300" />
              <span>Employer / Hiring Team</span>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
            {/* If Employer: Company Name */}
            {activeRole === 'employer' && (
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-2">
                <Input
                  label="Company / Organization Name *"
                  type="text"
                  placeholder="e.g. Acme Tech, Stripe, Startup Labs"
                  icon={<Building2 className="w-4 h-4 text-purple-400" />}
                  error={errors.companyName?.message}
                  {...register('companyName')}
                />
              </div>
            )}

            {/* Step 1 & 2: Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={activeRole === 'employer' ? '1. Hiring Lead / Recruiter Name *' : '1. Full Name *'}
                type="text"
                placeholder="e.g. Yash Thakur"
                icon={<User className="w-4 h-4 text-slate-400" />}
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                label={activeRole === 'employer' ? '2. Work Email Address *' : '2. Email Address *'}
                type="email"
                placeholder={activeRole === 'employer' ? 'recruiter@company.com' : 'yash@example.com'}
                icon={<Mail className="w-4 h-4 text-slate-400" />}
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            {/* Step 3 & 4: Mobile Number & Username */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="3. Mobile Number *"
                type="tel"
                placeholder="+91 98765 43210"
                icon={<Phone className="w-4 h-4 text-slate-400" />}
                error={errors.mobileNumber?.message}
                {...register('mobileNumber')}
              />

              <Input
                label="4. Create Username *"
                type="text"
                placeholder={activeRole === 'employer' ? 'e.g. acme_hr' : 'e.g. yash_dev'}
                icon={<AtSign className="w-4 h-4 text-slate-400" />}
                error={errors.username?.message}
                {...register('username')}
              />
            </div>

            {/* Step 5: Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="5a. Create Password *"
                type="password"
                placeholder="At least 6 characters"
                icon={<Lock className="w-4 h-4 text-slate-400" />}
                error={errors.password?.message}
                {...register('password')}
              />

              <Input
                label="5b. Confirm Password *"
                type="password"
                placeholder="Re-enter password"
                icon={<ShieldCheck className="w-4 h-4 text-slate-400" />}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </div>

            {/* Step 6: Select Country */}
            <div>
              <Controller
                control={control}
                name="countryCode"
                render={({ field }) => (
                  <CountrySelector
                    label="6. Select Country / Primary Location *"
                    supportingText="Personalizes remote, hybrid, and local opportunities to your region."
                    value={field.value}
                    onChange={(code, name) => {
                      field.onChange(code);
                      setValue('countryName', name);
                    }}
                    error={errors.countryCode?.message}
                    placeholder="Search and select your country..."
                  />
                )}
              />
            </div>

            {/* Step 7: Select Domains */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs sm:text-sm font-bold text-slate-200 tracking-tight flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>7. Select Target Domains *</span>
                </label>
                <span className="text-xs text-slate-400 font-medium">
                  {selectedDomains.length} domain{selectedDomains.length !== 1 ? 's' : ''} active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Choose the technical fields and specializations you are targeting:
              </p>

              {/* Domain Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {DEFAULT_DOMAINS.map((domain) => {
                  const isSelected = selectedDomains.includes(domain);
                  return (
                    <button
                      key={domain}
                      type="button"
                      onClick={() => toggleDomain(domain)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-600/30 to-indigo-600/30 text-cyan-300 border border-cyan-400/60 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                          : 'bg-slate-900/80 text-slate-400 border border-white/10 hover:border-white/20 hover:text-slate-200'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                      <span>{domain}</span>
                    </button>
                  );
                })}

                {/* Custom added domains */}
                {selectedDomains
                  .filter((d) => !DEFAULT_DOMAINS.includes(d))
                  .map((customDomain) => (
                    <button
                      key={customDomain}
                      type="button"
                      onClick={() => toggleDomain(customDomain)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer bg-gradient-to-r from-blue-600/30 to-indigo-600/30 text-cyan-300 border border-cyan-400/60 shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                    >
                      <span>{customDomain}</span>
                      <X className="w-3 h-3 text-cyan-400 hover:text-rose-400" />
                    </button>
                  ))}
              </div>

              {/* Add custom domain field */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={customDomainInput}
                  onChange={(e) => setCustomDomainInput(e.target.value)}
                  placeholder="Add another domain (e.g. Embedded Systems, Rust Engineer)..."
                  className="flex-1 genz-input-surface px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomDomain(e);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomDomain}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Add</span>
                </button>
              </div>
              {errors.domains && (
                <p className="text-xs text-rose-400 font-semibold">• {errors.domains.message}</p>
              )}
            </div>

            {/* Step 8: Submit application */}
            <div className="pt-4 border-t border-white/10">
              <Button
                type="submit"
                variant="primary"
                className={`w-full py-4 text-base font-bold shadow-xl cursor-pointer rounded-xl flex items-center justify-center gap-2 ${
                  activeRole === 'employer'
                    ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-purple-500/25'
                    : 'genz-btn-primary shadow-blue-500/25'
                }`}
                loading={isLoading}
              >
                <span>
                  {activeRole === 'employer'
                    ? 'Submit Employer Application & Launch Console'
                    : '8. Submit New User Application'}
                </span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </Button>
              <p className="text-center text-xs text-slate-400 mt-3 font-medium">
                {activeRole === 'employer'
                  ? 'Your company workspace will be created instantly. Post roles immediately without email OTP friction.'
                  : 'By submitting, your candidate account is immediately activated. Zero email verification code required.'}
              </p>
            </div>
          </form>
        </div>

        {/* Footer Navigation */}
        <p className="text-center text-slate-400 text-sm font-medium mt-6">
          Already have an existing account?{' '}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline ml-1">
            Sign In with Username or Email →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
