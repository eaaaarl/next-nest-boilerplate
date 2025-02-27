'use client';

import { loginPayload, loginSchema } from '@/app/schema/login.schema';
import { useAuth } from '@/lib/context/state/authContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const useSignInForm = () => {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const { SignIn, isSignIn } = useAuth();

  const handleLogin = (payload: loginPayload) => {
    SignIn(payload);
  };

  return {
    handleLogin,
    form,
    isSignIn,
  };
};

export default useSignInForm;
