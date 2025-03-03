'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import useSignInForm from '@/features/auth/hooks/useSignInForm';
import SignInForm from '@/features/auth/components/SignInForm';

export default function LoginForm() {
  const { form, handleLogin, isSignIn } = useSignInForm();
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm IsSignIn={isSignIn} form={form} onSubmit={handleLogin} />
        </CardContent>
      </Card>
    </div>
  );
}
