import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { CountrySelector } from '../../components/ui/CountrySelector';
import { OTPVerification } from '../../components/auth/OTPVerification';
import { Sparkles, Building2, User } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['job_seeker', 'employer'] as const),
  companyName: z.string().optional(),
  countryCode: z.string().min(2, 'Please select your target country'),
  countryName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
}).refine((data) => {
  if (data.role === 'employer') {
    return data.companyName && data.companyName.length >= 2;
  }
  return true;
}, {
  message: 'Company name is required for employers',
  path: ['companyName'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'job_seeker' | 'employer'>('job_seeker');
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);
  const [registeredRole, setRegisteredRole] = useState<'job_seeker' | 'employer'>('job_seeker');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'job_seeker',
      countryCode: '',
      countryName: '',
    },
  });

  const handleRoleChange = (role: 'job_seeker' | 'employer') => {
    setSelectedRole(role);
    setValue('role', role);
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        companyName: data.companyName,
        countryCode: data.countryCode,
        countryName: data.countryName,
      });

      if (response.requireVerification) {
        setRegisteredRole(data.role);
        setPendingVerificationEmail(data.email);
      } else {
        navigate(response.user.role === 'employer' ? '/employer/dashboard' : '/seeker/dashboard');
      }
    } catch (error) {
      // Error is handled by toast in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSuccess = () => {
    navigate(registeredRole === 'employer' ? '/employer/dashboard' : '/seeker/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#EFF6FF]/40 flex items-center justify-center px-4 py-12 subtle-mesh">
      <div className="w-full max-w-lg">
        {pendingVerificationEmail ? (
          <OTPVerification
            email={pendingVerificationEmail}
            onSuccess={handleVerificationSuccess}
            onBack={() => setPendingVerificationEmail(null)}
          />
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Join Workmark Today</span>
              </div>
              <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Create Your Account</h1>
              <p className="text-[#64748B] text-sm mt-1">Discover opportunities tailored to your country and career goals</p>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-900/5">
              {/* Role Selection Tabs */}
              <div className="flex p-1.5 mb-6 bg-[#F1F5F9] rounded-2xl border border-[#E2E8F0]/80">
                <button
                  type="button"
                  onClick={() => handleRoleChange('job_seeker')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                    selectedRole === 'job_seeker'
                      ? 'bg-white text-[#0F172A] shadow-sm font-bold'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  <User className="h-4 w-4 text-[#2563EB]" />
                  <span>Job Seeker</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('employer')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                    selectedRole === 'employer'
                      ? 'bg-white text-[#0F172A] shadow-sm font-bold'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  <Building2 className="h-4 w-4 text-[#2563EB]" />
                  <span>Employer</span>
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="e.g. Alex Taylor"
                  error={errors.name?.message}
                  {...register('name')}
                />

                <Input
                  label="Work or Personal Email"
                  type="email"
                  placeholder="alex@example.com"
                  error={errors.email?.message}
                  {...register('email')}
                />

                {/* Country Selector Field */}
                <div>
                  <Controller
                    control={control}
                    name="countryCode"
                    render={({ field }) => (
                      <CountrySelector
                        label="Where are you looking for opportunities?"
                        supportingText="We'll personalize your job feed based on your location. You can change this anytime."
                        value={field.value}
                        onChange={(code, name) => {
                          field.onChange(code);
                          setValue('countryName', name);
                        }}
                        error={errors.countryCode?.message}
                        placeholder="Choose your preferred country..."
                      />
                    )}
                  />
                </div>

                {selectedRole === 'employer' && (
                  <Input
                    label="Company Name"
                    type="text"
                    placeholder="e.g. Acme Technologies"
                    error={errors.companyName?.message}
                    {...register('companyName')}
                  />
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    error={errors.password?.message}
                    {...register('password')}
                  />

                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="••••••••"
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword')}
                  />
                </div>

                <input type="hidden" {...register('role')} />

                <Button
                  type="submit"
                  className="w-full py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-[#2563EB]/25 mt-2"
                  loading={isLoading}
                >
                  Create Free Account
                </Button>
              </form>
            </div>

            <p className="text-center text-[#64748B] text-sm mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-[#2563EB] hover:text-[#1d4ed8] font-bold">
                Sign In
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};
