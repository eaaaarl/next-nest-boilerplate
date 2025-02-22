'use client';

import NonAuthRoute from '@/components/NonAuthRoute';
import React, { ReactNode } from 'react';

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <NonAuthRoute>{children}</NonAuthRoute>;
};

export default Layout;
