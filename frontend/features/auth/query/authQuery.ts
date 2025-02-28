import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/authApi';

export const authQuery = () => {
  const { data, isPending } = useQuery({
    queryKey: ['users-profile'],
    queryFn: authApi.profile,
    enabled:
      typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
  });

  return {
    UserProfile: data,
    IsUserProfile: isPending,
  };
};
