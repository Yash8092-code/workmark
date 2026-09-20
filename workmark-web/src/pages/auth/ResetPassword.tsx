import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, KeyRound, AlertCircle, ArrowRight, Lock } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { resetPassword } from '../../api/auth';
import toast from 'react-hot-toast';

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Invalid or missing password reset token.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(token, data.password);
      setIsSuccess(true);
      toast.success('Password updated successfully!');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden bg-[#090D16]">
        <div className="relative z-10 w-full max-w-md">
          <div className="genz-card p-8 text-center backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Invalid Reset Link</h2>
            <p className="text-slate-400 text-sm font-medium mb-6">
              This password reset link is invalid or expired. Please request a new recovery link.
            </p>
            <Button variant="primary" onClick={() => navigate('/forgot-password')} className="w-full">
              Request New Link
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden bg-[#090D16]">
        <div className="relative z-10 w-full max-w-md">
          <div className="genz-card p-8 text-center backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Password Updated</h2>
            <p className="text-slate-400 text-sm font-medium mb-6">
              Your password has been reset successfully. You can now sign in with your updated credentials.
            </p>
            <Button variant="primary" onClick={() => navigate('/login')} className="w-full">
              <span>Sign In to Workmark</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden bg-[#090D16]">
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/25 rounded-2xl flex items-center justify-center mx-auto mb-3 text-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
            <KeyRound className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Create New Password</h1>
          <p className="text-slate-400 text-sm font-medium mt-1">Please choose a strong, secure new password</p>
        </div>

        <div className="genz-card p-6 sm:p-8 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="New Password"
              type="password"
              placeholder="Enter at least 6 characters"
              icon={<Lock className="w-4 h-4 text-slate-400" />}
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Re-enter your new password"
              icon={<Lock className="w-4 h-4 text-slate-400" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3.5 shadow-lg shadow-blue-500/25 font-bold cursor-pointer mt-2"
              loading={isLoading}
            >
              Update Password
            </Button>
          </form>
        </div>

        <p className="text-center text-slate-400 mt-6 text-sm font-medium">
          Remember your credentials?{' '}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline ml-1">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
