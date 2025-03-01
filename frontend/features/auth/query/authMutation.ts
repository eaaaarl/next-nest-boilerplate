import { userProfileValues } from '@/app/schema/user.schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { toast } from 'sonner';

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: userProfileValues }) =>
      authApi.updateProfile(payload, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-profile'] });
    },
    onError: (e) => {
      toast.error(e.message || 'Failed to update profile');
    },
  });

  return {
    updateProfileUser: updateMutation.mutate,
    IsUpdatingProfileUser: updateMutation.isPending,
  };
};
