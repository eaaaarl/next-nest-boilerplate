import { authService } from '@/lib/auth';
import api from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';

export const useUserQuery = () => {
  const { data, isPending } = useQuery({
    queryKey: ['user-profile'],
    queryFn: authService.profile,
  });

  return {
    user: data,
    isLoadingProfile: isPending,
  };
};

export const useUserListQuery = () => {
  const { data, isPending } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get(`/user`);
      return response.data;
    },
  });

  return {
    users: data?.data,
    isLoading: isPending,
  };
};
