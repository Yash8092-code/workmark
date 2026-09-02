import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

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
      const authenticatedUser = await login(data);
      navigate(authenticatedUser.role === 'employer' ? '/employer/dashboard' : authenticatedUser.role === 'admin' ? '/admin/dashboard' : '/seeker/dashboard');
    } catch (error) {
      // Error is handled by toast in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#172033] mb-2">Welcome Back</h1>
          <p className="text-[#64748B]">Sign in to your Workmark account</p>
        </div>

        <Card>
          <Card.Body>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register('password')}
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-[#2563EB] border-[#E2E8F0] rounded focus:ring-[#2563EB]"
                  />
                  <span className="ml-2 text-sm text-[#64748B]">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-[#2563EB] hover:text-[#1d4ed8]">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" loading={isLoading}>
                Sign In
              </Button>
            </form>
          </Card.Body>
        </Card>

        <p className="text-center text-[#64748B] mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#2563EB] hover:text-[#1d4ed8] font-medium">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};
