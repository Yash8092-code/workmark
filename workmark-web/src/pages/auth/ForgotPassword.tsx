import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { forgotPassword } from '../../api/auth';
import { CheckCircle2, KeyRound, Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await forgotPassword(data.email);
      setSubmitted(true);
      toast.success('Password reset link sent to your email');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden bg-[#090D16]">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 w-full max-w-md">
          <div className="genz-card p-8 text-center backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Check Your Inbox</h2>
            <p className="text-slate-400 text-sm font-medium mb-6 leading-relaxed">
              If an account exists with that email, we've sent a direct password reset link. Please click the link inside to set a new password.
            </p>
            <Link to="/login">
              <Button variant="primary" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Button>
            </Link>
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
          <h1 className="text-3xl font-black text-white tracking-tight">Recovery Access</h1>
          <p className="text-slate-400 text-sm font-medium mt-1">
            Enter your registered email to receive a password reset link
          </p>
        </div>

        <div className="genz-card p-6 sm:p-8 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Account Email"
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="w-4 h-4 text-slate-400" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3.5 shadow-lg shadow-blue-500/25 font-bold cursor-pointer mt-2"
              loading={isLoading}
            >
              Send Recovery Link
            </Button>
          </form>
        </div>

        <p className="text-center text-slate-400 text-sm font-medium mt-6">
          Remembered your password?{' '}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline ml-1">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
