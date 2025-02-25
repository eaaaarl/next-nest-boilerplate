'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Session } from '@/lib/session';

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const processAuth = () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const userParam = searchParams.get('user');

      if (!accessToken || !refreshToken || !userParam) {
        router.push('/');
        return;
      }

      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        const sessionCreated = Session.createSession(
          refreshToken,
          accessToken,
          user
        );

        router.push(sessionCreated ? '/dashboard' : '/');
      } catch (error) {
        console.error('Error parsing user:', error);
        router.push('/');
      }
    };

    processAuth();
  }, [searchParams, router]);

  return null;
}
