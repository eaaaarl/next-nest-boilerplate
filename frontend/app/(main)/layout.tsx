import AuthenticatedRoute from '@/components/AuthenticatedRoute';
import { Layout } from '@/components/Layout';
import { ReactNode } from 'react';

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <AuthenticatedRoute>
      <Layout>{children}</Layout>
    </AuthenticatedRoute>
  );
}
