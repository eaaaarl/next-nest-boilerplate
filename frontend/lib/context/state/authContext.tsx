'use client';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { User } from '../types/user.type';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/features/auth/api/authApi';
import { toast } from 'sonner';
import { SignInPayload } from '@/features/auth/api/interface';

interface AuthContext {
  user: User | null;
  isAuthenticated: boolean;
  SignIn: (action: SignInPayload) => void;
  isSignIn: boolean;
  Logout?: () => void;
  updateAuthState: (user: User, authenticated: boolean) => void;
}

const AuthContext = createContext<AuthContext>({
  user: null,
  isAuthenticated: false,
  SignIn: (action: SignInPayload) => {},
  isSignIn: true,
  Logout: () => {},
  updateAuthState: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedUser =
      typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const accessToken =
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;

    if (storedUser && accessToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
  }, []);

  const updateAuthState = (user: User, authenticated: boolean) => {
    setUser(user);
    setIsAuthenticated(authenticated);
  };

  const removeAuth = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const loginMutation = useMutation({
    mutationFn: authApi.signIn,
    onSuccess: async (data) => {
      if (data) {
        setIsAuthenticated(true);
        setUser(data.user);
        router.push(`/dashboard`);
        queryClient.invalidateQueries({ queryKey: ['users-profile'] });

        localStorage.setItem('accessToken', data.tokens.access_token);
        localStorage.setItem('refreshToken', data.tokens.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    },
    onError: (e) => {
      toast.error(e.message || 'Failed to login, please try again');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-profile'] });
      removeAuth();
      router.push(`/`);
    },
  });

  const value = {
    isAuthenticated,
    user,
    SignIn: loginMutation.mutate,
    isSignIn: loginMutation.isPending,
    Logout: logoutMutation.mutate,
    updateAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
