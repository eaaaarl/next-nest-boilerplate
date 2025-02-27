import { useAuth } from '@/lib/context/state/authContext';

export const useLogout = () => {
  const { Logout } = useAuth();
  return { Logout };
};
