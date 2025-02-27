import { useAuth } from '@/lib/context/state/authContext';

export const useGitHubAuth = () => {
  const { updateAuthState } = useAuth();
  return { updateAuthState };
};
