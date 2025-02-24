import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/app/hooks/useSession';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  allowedRoles = [],
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Handle server-side rendering
    if (typeof window === 'undefined') return;

    if (requireAuth && !isAuthenticated) {
      router.replace('/');
      return;
    }

    // Optional role-based access control
    if (requireAuth && allowedRoles.length > 0 && user) {
      const hasAllowedRole = allowedRoles.some((role) =>
        user.roles?.includes(role)
      );
      if (!hasAllowedRole) {
        router.replace('/');
        return;
      }
    }
  }, [isAuthenticated, user, requireAuth, allowedRoles, router]);

  // Don't render anything while checking authentication
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
