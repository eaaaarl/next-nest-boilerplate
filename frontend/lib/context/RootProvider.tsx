import { ReactNode } from 'react';
import { AuthProvider } from './state/authContext';

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};
