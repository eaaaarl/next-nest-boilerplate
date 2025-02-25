'use client';

import { Layout } from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ReactNode } from 'react';

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}
