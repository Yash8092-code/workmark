import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ArrowRight, UserCheck, Eye, EyeOff, Building2, User } from 'lucide-react';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Please enter your username or email address').trim(),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const initialRole = searchParams.get('role') === 'employer' ? 'employer' : 'job_seeker';
  const [selectedRole, setSelectedRole] = useState<'job_seeker' | 'employer'>(initialRole);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const authenticatedUser = await login({
        identifier: data.identifier,
        email: data.identifier.includes('@') ? data.identifier : undefined,
        username: !data.identifier.includes('@') ? data.identifier : undefined,
        password: data.password,
      });
      navigate(
        authenticatedUser.role === 'employer'
          ? '/employer/dashboard'
          : authenticatedUser.role === 'admin'
          ? '/admin/dashboard'
          : '/seeker/dashboard'
      );
    } catch (error) {
      // Error is handled by toast in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden bg-[#080C15]">
      {/* Ambient background glow effects */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#327CF6]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#8B5CF6]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#38BDF8]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header Badge & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-cyan-400 border border-cyan-500/20 mb-4 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="tracking-wide">
              {selectedRole === 'employer' ? 'Recruiter & Employer Console' : 'Direct Career Access'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {selectedRole === 'employer' ? (
              <>
                Employer <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400">Portal</span>
              </>
            ) : (
              <>
                Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">Back</span>
              </>
            )}
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-2">
            {selectedRole === 'employer'
              ? 'Sign in to manage job openings, review talent pipelines, and hire top builders.'
              : 'Sign in with your username or email to enter your career workspace.'}
          </p>
        </div>

        {/* Form Card */}
        <div className="genz-card p-6 sm:p-8 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
          {/* Role Switcher Pill */}
          <div className="flex items-center p-1.5 bg-slate-950/80 rounded-2xl border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => setSelectedRole('job_seeker')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRole === 'job_seeker'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>Candidate</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('employer')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRole === 'employer'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="h-3.5 w-3.5 text-purple-300" />
              <span>Employer / Recruiter</span>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Field 1: Username or Email */}
            <Input
              label={selectedRole === 'employer' ? 'Work Email or Username' : 'Username or Email'}
              type="text"
              placeholder={selectedRole === 'employer' ? 'recruiter@company.com or acme_hr' : 'e.g. dev_alex or alex@workmark.com'}
              icon={<UserCheck className="w-4 h-4 text-slate-400" />}
              error={errors.identifier?.message}
              {...register('identifier')}
            />

            {/* Field 2: Password with toggle */}
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                error={errors.password?.message}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-slate-200 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                {...register('password')}
              />
            </div>

            {/* Forgot password & Remember Me */}
            <div className="flex items-center justify-between text-xs font-semibold pt-1">
              <label className="flex items-center cursor-pointer text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  className="h-4 w-4 bg-slate-900 border-white/20 rounded text-blue-500 focus:ring-cyan-400/30"
                />
                <span className="ml-2">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-cyan-400 hover:text-cyan-300 transition-colors hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              variant="primary"
              className={`w-full py-3.5 font-bold shadow-lg cursor-pointer text-sm sm:text-base mt-2 ${
                selectedRole === 'employer'
                  ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-purple-500/25'
                  : 'genz-btn-primary shadow-blue-500/25'
              }`}
              loading={isLoading}
            >
              <span>{selectedRole === 'employer' ? 'Sign In to Employer Console' : 'Sign In to Workmark'}</span>
              <ArrowRight className="w-4 h-4 ml-2 stroke-[2.5]" />
            </Button>
          </form>
        </div>

        {/* Footer Navigation */}
        <div className="text-center mt-6 space-y-2 text-sm font-medium text-slate-400">
          <p>
            {selectedRole === 'employer' ? "Don't have an employer account yet? " : "Don't have an account yet? "}
            <Link
              to={selectedRole === 'employer' ? '/register?role=employer' : '/register'}
              className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline ml-1"
            >
              {selectedRole === 'employer' ? 'Register as Employer →' : 'Submit User Application →'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
