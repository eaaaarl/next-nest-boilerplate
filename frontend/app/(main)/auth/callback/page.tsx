'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Session } from '@/lib/session';
import { useSession } from '@/app/hooks/useSession';

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');
  const userParam = searchParams.get('user');

  useEffect(() => {
    const getTokens = () => {
      if (accessToken && refreshToken && userParam) {
        try {
          const user = JSON.parse(decodeURIComponent(userParam));
          Session.createSession(refreshToken, accessToken, user);

          router.push('/dashboard');
        } catch (error) {
          console.error('Error parsing user:', error);
          router.push('/');
        }
      } else {
        router.push('/');
      }
    };
    getTokens();
  }, [accessToken, refreshToken, userParam, router]);

  return null;
}
