'use client';

import { ProtectedRoute } from '@/components/AuthenticatedRoute';
import { Layout } from '@/components/Layout';
import { ReactNode } from 'react';

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requireAuth>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}
