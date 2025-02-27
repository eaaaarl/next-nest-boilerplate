import api from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';

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

export const useUserFindByIdQuery = (id: string) => {
  const { data, isPending } = useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      const response = await api.get(`/user/${id}`);
      return response.data;
    },
  });

  return {
    user: data?.data,
    isLoading: isPending,
  };
};
