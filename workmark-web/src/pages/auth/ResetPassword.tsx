import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, KeyRound, AlertCircle } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { resetPassword } from '../../api/auth';
import toast from 'react-hot-toast';

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
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
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card>
            <Card.Body className="text-center p-8">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-[#172033] mb-2">Invalid Reset Link</h2>
              <p className="text-[#64748B] mb-6">
                This password reset link is invalid or incomplete. Please request a new link from the forgot password page.
              </p>
              <Button onClick={() => navigate('/forgot-password')} className="w-full">
                Request New Link
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card>
            <Card.Body className="text-center p-8">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-[#172033] mb-2">Password Reset Complete</h2>
              <p className="text-[#64748B] mb-6">
                Your password has been successfully updated. You can now sign in with your new credentials.
              </p>
              <Button onClick={() => navigate('/login')} className="w-full">
                Sign In to Workmark
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#2563EB]">
            <KeyRound className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold text-[#172033] mb-2">Create New Password</h1>
          <p className="text-[#64748B]">Please enter and confirm your new password below</p>
        </div>

        <Card>
          <Card.Body className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="New Password"
                type="password"
                placeholder="Enter at least 6 characters"
                error={errors.password?.message}
                {...register('password')}
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Re-enter your new password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <Button type="submit" className="w-full" loading={isLoading}>
                Update Password
              </Button>
            </form>
          </Card.Body>
        </Card>

        <p className="text-center text-[#64748B] mt-6 text-sm">
          Remembered your credentials?{' '}
          <Link to="/login" className="text-[#2563EB] hover:text-[#1d4ed8] font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
export default ResetPassword;
