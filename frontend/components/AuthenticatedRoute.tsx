'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useSession } from '@/app/hooks/useSession';
import { useRouter } from 'next/navigation';

function AuthenticatedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);
  if (!mounted) {
    return null;
  }
  if (!isAuthenticated) return null;

  return <>{children}</>;
}

export default AuthenticatedRoute;
