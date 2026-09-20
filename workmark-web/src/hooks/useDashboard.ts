import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard';
import { useAuth } from './useAuth';

export const useSeekerDashboard = () => {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: ['dashboard', 'seeker', user?._id],
    queryFn: () => dashboardApi.getSeekerDashboard(),
    enabled: isAuthenticated && user?.role === 'job_seeker',
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useEmployerDashboard = () => {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: ['dashboard', 'employer', user?._id],
    queryFn: () => dashboardApi.getEmployerDashboard(),
    enabled: isAuthenticated && user?.role === 'employer',
    staleTime: 30 * 1000, // 30 seconds
  });
};
