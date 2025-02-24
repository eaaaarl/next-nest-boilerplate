import { authService } from '@/lib/auth';
import api from '@/lib/axios';
import { Session } from '@/lib/session';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const useAuthMutation = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Session.isAuthenticated()
  );

  const queryClient = useQueryClient();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      const accessToken = data.tokens.access_token;
      const refreshToken = data.tokens.refresh_token;
      const user = data.user;
      Session.createSession(refreshToken, accessToken, user);
      setIsAuthenticated(true);
      router.push(`/dashboard`);
    },
    onError: (error) => {
      console.error(error);
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
