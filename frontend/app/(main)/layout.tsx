'use client';

import { Layout } from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import React, { ReactNode } from 'react';

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
};

export default layout;
