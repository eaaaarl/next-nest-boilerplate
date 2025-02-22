'use client';

import { useUserMutation } from '@/app/hooks/useUserMutation';
import { userSchema, userValues } from '@/app/schema/user.schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import React from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

function CreateFormPage() {
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      course: '',
      studentID: '',
    },
  });

  const { createUser, isCreating } = useUserMutation();

  const onSubmit = (payload: userValues) => {
    createUser(payload, {
      onSuccess: () => {
        toast.success('User created');
        form.reset({
          name: '',
          course: '',
          studentID: '',
        });
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create User Form</CardTitle>
      </CardHeader>
      <CardContent>
        <FormInput form={form} onSubmit={onSubmit} isLoading={isCreating} />
      </CardContent>
    </Card>
  );
}

export default CreateFormPage;

interface FormInputProps {
  form: UseFormReturn<userValues>;
  onSubmit: (payload: userValues) => void;
  isLoading: boolean;
}

const FormInput = ({ form, onSubmit, isLoading }: FormInputProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="gap-2 space-y-6">
        <FormField
          control={form.control}
          name="studentID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="course"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isLoading}>
          {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : 'Submit'}
        </Button>
      </form>
    </Form>
  );
};
