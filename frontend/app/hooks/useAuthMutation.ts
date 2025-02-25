import { authService } from '@/lib/auth';
import { Session } from '@/lib/session';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export const useAuthMutation = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Session.isAuthenticated()
  );

  const queryClient = useQueryClient();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      if (data) {
        const accessToken = await data.tokens.access_token;
        const refreshToken = await data.tokens.refresh_token;
        const user = await data.user;
        Session.createSession(refreshToken, accessToken, user);
        setIsAuthenticated(true);
        router.push(`/dashboard`);
      }
    },
    onError: (e) => {
      console.error(e);
      toast.error(e.message);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-profile'] });
      Session.destroySession();
      router.push(`/`);
    },
  });

  return {
    isAuthenticated,
    login: loginMutation.mutate,
    isLoading: loginMutation.isPending,
    logout: logoutMutation.mutate,
  };
};
