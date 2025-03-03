'use client';

import { signUpValues } from '@/app/schema/singup.schema';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Github, Loader } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';

interface SingUpFormProps {
  form: UseFormReturn<signUpValues>;
  onSubmit: (payload: signUpValues) => void;
  isSignUp: boolean;
}

const SingUpForm = ({ form, onSubmit, isSignUp }: SingUpFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
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

        <div className="mt-4">
          <Button disabled={isSignUp} type="submit" className="w-full">
            {isSignUp ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              'Create an account'
            )}
          </Button>

          <Link href={`${process.env.NEXT_PUBLIC_API_URL}/auth/github/login`}>
            <Button
              disabled={isSignUp}
              type="button"
              variant="outline"
              className="mt-4 w-full"
            >
              <Github /> Sign up with Github
            </Button>
          </Link>
        </div>

        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/" className="underline">
            Sign in
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default SingUpForm;
