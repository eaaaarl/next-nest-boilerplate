'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import SingUpForm from '@/features/auth/components/SingUpForm';
import { useSingUpForm } from '@/features/auth/hooks/useSignUpForm';

export default function SingUpPage() {
  const { form, handleSignUp, isSingUp } = useSingUpForm();
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SingUpForm form={form} onSubmit={handleSignUp} isSignUp={isSingUp} />
        </CardContent>
      </Card>
    </div>
  );
}
