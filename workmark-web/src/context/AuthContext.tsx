import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginInput, RegisterInput, VerifyEmailInput, ResendOTPInput } from '../types';
import * as authApi from '../api/auth';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginInput) => Promise<User>;
  register: (data: RegisterInput) => Promise<{ user: User; requireVerification?: boolean }>;
  verifyEmail: (data: VerifyEmailInput) => Promise<User>;
  resendOTP: (data: ResendOTPInput) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
  updateCountry: (countryCode: string, countryName?: string) => Promise<void>;
  setAuthSession: (user: User, token: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const userData = await authApi.getMe();
      setUser(userData);
    } catch (error) {
      sessionStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    localStorage.removeItem('token');
    fetchUser();
  }, []);

  const setAuthSession = (authUser: User, token: string) => {
    sessionStorage.setItem('token', token);
    setUser(authUser);
  };

  const login = async (data: LoginInput): Promise<User> => {
    try {
      const response = await authApi.login(data);
      sessionStorage.setItem('token', response.token);
      setUser(response.user);
      toast.success('Welcome back!');
      return response.user;
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const register = async (data: RegisterInput): Promise<{ user: User; requireVerification?: boolean }> => {
    try {
      const response = await authApi.register(data);
      if (response.token && response.user.isVerified) {
        sessionStorage.setItem('token', response.token);
        setUser(response.user);
      }
      return {
        user: response.user,
        requireVerification: response.requireVerification !== false,
      };
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const verifyEmail = async (data: VerifyEmailInput): Promise<User> => {
    try {
      const response = await authApi.verifyEmail(data);
      sessionStorage.setItem('token', response.token);
      setUser(response.user);
      toast.success('Email verified successfully! Welcome to Workmark.');
      return response.user;
    } catch (error: any) {
      toast.error(error.message || 'Verification failed');
      throw error;
    }
  };

  const resendOTP = async (data: ResendOTPInput): Promise<void> => {
    try {
      const response = await authApi.resendOTP(data);
      toast.success(response.message || 'Verification code resent!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend code');
      throw error;
    }
  };

  const updateCountry = async (countryCode: string, countryName?: string) => {
    try {
      const response = await authApi.updateCountry({ countryCode, countryName });
      setUser(response.data.user);
      toast.success(response.message || 'Your job preferences have been updated.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update country preference');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      sessionStorage.removeItem('token');
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const refetchUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        verifyEmail,
        resendOTP,
        logout,
        refetchUser,
        updateCountry,
        setAuthSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
