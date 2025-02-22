import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userValues } from '../schema/user.schema';
import api from '@/lib/axios';
import { toast } from 'sonner';

export const useUserMutation = () => {
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: async (payload: userValues) => {
      const response = await api.post(`/user/create`, {
        studentID: payload.studentID,
        name: payload.name,
        course: payload.course,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (e: any) => {
      console.error(e);

      if (e?.response?.status === 409) {
        toast.error(e?.response?.data?.message);
        return;
      }

      toast.error('Failed to create user. Please try again.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/user/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (e) => {
      console.error(e);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: userValues;
    }) => {
      const response = await api.put(`/user/${id}/edit`, {
        studentID: payload.studentID,
        name: payload.name,
        course: payload.course,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (e: any) => {
      console.error(e);

      if (e?.response?.status === 409) {
        toast.error(e?.response?.data?.message);
        return;
      }

      toast.error('Failed to update user. Please try again.');
    },
  });

  return {
    createUser: createMutation.mutate,
    isCreating: createMutation.isPending,

    deleteUser: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,

    updateUser: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};
