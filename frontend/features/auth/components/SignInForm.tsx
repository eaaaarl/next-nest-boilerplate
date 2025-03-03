import React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Github, Loader } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { loginPayload } from '@/app/schema/login.schema';

interface LoginFormProps {
  form: UseFormReturn<loginPayload>;
  onSubmit: (payload: loginPayload) => void;
  IsSignIn: boolean;
}

function SignInForm({ form, onSubmit, IsSignIn }: LoginFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={IsSignIn} type="submit" className="w-full">
            {IsSignIn ? <Loader className="h-4 w-4 animate-spin" /> : 'Login'}
          </Button>

          <Link href={`${process.env.NEXT_PUBLIC_API_URL}/auth/github/login`}>
            <Button type="button" variant="outline" className="w-full">
              <Github /> Login with Github
            </Button>
          </Link>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
}

export default SignInForm;
