import { useAuth } from '@/lib/context/state/authContext';

const useUserProfile = () => {
  const { user } = useAuth();
  return { user };
};

export default useUserProfile;
