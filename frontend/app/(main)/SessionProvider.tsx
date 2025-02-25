'use client';

import { authService } from '@/lib/auth';
import { Session } from '@/lib/session';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { toast } from 'sonner';

export const AuthContext = createContext({
  isAuthenticated: false,
  login: ({ username, password }: { username: string; password: string }) => {},
  isLoading: true,

  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

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

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = Session.isAuthenticated();
      // const userData = Session.getUser()?.user || null;
      setIsAuthenticated(authStatus);
      // setUser(userData);
      // setIsLoading(false);
    };

    checkAuth();

    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);

    const timeoutId = setTimeout(checkAuth, 200);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login: loginMutation.mutate,
        isLoading: loginMutation.isPending,
        logout: logoutMutation.mutate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
