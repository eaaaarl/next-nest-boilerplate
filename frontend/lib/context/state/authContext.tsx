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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/features/auth/api/authApi';
import { toast } from 'sonner';
import { SignInPayload } from '@/features/auth/api/interface';
import { authQuery } from '@/features/auth/query/authQuery';
import { signUpValues } from '@/app/schema/singup.schema';

interface AuthContext {
  user: User | null;
  isAuthenticated: boolean;

  SignIn: (action: SignInPayload) => void;
  isSignIn: boolean;

  SignUp: (action: signUpValues) => void;
  isSingUp: boolean;

  Logout?: () => void;
  updateAuthState: (authenticated: boolean) => void;
}

const AuthContext = createContext<AuthContext>({
  user: null,
  isAuthenticated: false,

  SignIn: (action: SignInPayload) => {},
  isSignIn: true,

  SignUp: (action: signUpValues) => {},
  isSingUp: true,

  Logout: () => {},
  updateAuthState: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { UserProfile } = authQuery();

  useEffect(() => {
    const accessToken =
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;

    if (accessToken) {
      try {
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
  }, []);

  useEffect(() => {
    if (UserProfile) {
      setUser(UserProfile);
      localStorage.setItem('user', JSON.stringify(UserProfile));
    }
  }, [UserProfile]);

  const updateAuthState = (authenticated: boolean) => {
    setIsAuthenticated(authenticated);
  };

  const removeAuth = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const signUpMutation = useMutation({
    mutationFn: authApi.signUp,
    onSuccess: (data) => {
      setIsAuthenticated(true);
      router.push(`/dashboard`);
      queryClient.invalidateQueries({ queryKey: ['users-profile'] });

      localStorage.setItem('accessToken', data.access_token);
      localStorage.setItem('refreshToken', data.refresh_token);
    },
    onError: (e) => {
      toast.error(e.message || 'Failed to signup, please try again');
    },
  });

  const loginMutation = useMutation({
    mutationFn: authApi.signIn,
    onSuccess: async (data) => {
      setIsAuthenticated(true);
      router.push(`/dashboard`);
      queryClient.invalidateQueries({ queryKey: ['users-profile'] });

      localStorage.setItem('accessToken', data.tokens.access_token);
      localStorage.setItem('refreshToken', data.tokens.refresh_token);
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
      window.location.href = `/`;
    },
    onError: (e) => {
      toast.error(e.message || 'Failed to logout');
      removeAuth();
    },
  });

  const value = {
    isAuthenticated,
    user,
    SignIn: loginMutation.mutate,
    isSignIn: loginMutation.isPending,
    SignUp: signUpMutation.mutate,
    isSingUp: signUpMutation.isPending,
    Logout: logoutMutation.mutate,
    updateAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
