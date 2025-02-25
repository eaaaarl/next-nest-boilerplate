import { Session } from '@/lib/session';
import { useEffect, useState } from 'react';

export function useSession() {
  const [session, setSession] = useState(() => ({
    isAuthenticated: Session.isAuthenticated(),
    user: Session.getUser(),
  }));

  useEffect(() => {
    const updateSession = () => {
      console.log('🔄 Updating session from storage change');
      setSession({
        isAuthenticated: Session.isAuthenticated(),
        user: Session.getUser(),
      });
    };

    // Listen for storage updates
    window.addEventListener('storage', updateSession);

    updateSession();

    return () => window.removeEventListener('storage', updateSession);
  }, []);

  return session;
}
