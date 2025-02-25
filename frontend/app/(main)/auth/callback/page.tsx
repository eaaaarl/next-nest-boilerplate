'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Session } from '@/lib/session';

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
          const sessionCreated = Session.createSession(
            refreshToken,
            accessToken,
            user
          );
          if (sessionCreated) {
            setTimeout(() => {
              router.push('/dashboard');
            }, 300);
          } else {
            router.push('/');
          }
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
