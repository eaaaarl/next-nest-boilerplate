import { Session } from '@/lib/session';
import { useEffect, useState } from 'react';

export function useSession() {
  const [session, setSession] = useState({
    isAuthenticated: Session.isAuthenticated(),
    token: Session.getUser(),
    user: Session.getUser(),
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setSession({
        isAuthenticated: Session.isAuthenticated(),
        token: Session.getUser(),
        user: Session.getUser(),
      });
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return session;
}
