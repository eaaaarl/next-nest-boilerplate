'use client';
import { useGitHubAuth } from '@/features/auth/hooks/useGithubAuth';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { updateAuthState } = useGitHubAuth();

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
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        updateAuthState(user, true);

        router.push(`/dashboard`);
      } catch (error) {
        console.error('Error parsing user:', error);
        router.push('/');
      }
    };

    processAuth();
  }, [searchParams, router]);

  return null;
}
