import { useAuth } from '@/app/(main)/SessionProvider';
import { usePathname, useRouter } from 'next/navigation';
import React, { ReactNode, useEffect, useState } from 'react';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const chechAuth = async () => {
      if (pathname === '/auth/callback') {
        setCheckingAuth(false);
        return;
      }

      const timeout = setTimeout(() => {
        const authStatus = isAuthenticated;
        setCheckingAuth(false);

        if (!authStatus) {
          router.push('/');
        }
      }, 100);
      return () => clearTimeout(timeout);
    };

    chechAuth();
  }, [isAuthenticated, router, pathname]);

  if (checkingAuth) return null;

  return <>{children}</>;
}

export default ProtectedRoute;
