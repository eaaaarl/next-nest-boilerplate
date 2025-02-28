'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/lib/context/state/authContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRouteBase = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  // NON AUTH PAGES
  const publicPaths = ['/auth/callback', '/'];

  useEffect(() => {
    if (publicPaths.includes(pathname)) {
      setIsChecking(false);
      return;
    }

    if (!isAuthenticated) {
      router.push('/');
    }

    setIsChecking(false);
  }, [isAuthenticated, router, pathname]);

  if (publicPaths.includes(pathname)) {
    return <>{children}</>;
  }

  if (isChecking) {
    return null;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return null;
};

const ProtectedRoute = dynamic(() => Promise.resolve(ProtectedRouteBase), {
  ssr: false,
});

export default ProtectedRoute;
