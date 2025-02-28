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

      if (!accessToken || !refreshToken) {
        router.push('/');
        return;
      }

      try {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        updateAuthState(true);

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
