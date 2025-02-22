import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userValues } from '../schema/user.schema';
import api from '@/lib/axios';

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
    onError: (e) => {
      console.error(e);
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
    onError: (e) => {
      console.error(e);
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
