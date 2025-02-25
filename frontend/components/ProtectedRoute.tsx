'use client';
import { useAuth } from '@/app/(main)/SessionProvider';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState, ReactNode } from 'react';
import dynamic from 'next/dynamic';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRouteBase = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (pathname === '/auth/callback') {
      setIsChecking(false);
      return;
    }

    if (!isAuthenticated) {
      router.push('/');
    }

    setIsChecking(false);
  }, [isAuthenticated, router, pathname]);

  if (pathname === '/auth/callback') {
    return <>{children}</>;
  }

  if (isChecking || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

const ProtectedRoute = dynamic(() => Promise.resolve(ProtectedRouteBase), {
  ssr: false,
});

export default ProtectedRoute;
