'use client';

import { useUserMutation } from '@/app/hooks/useUserMutation';
import { useUserFindByIdQuery } from '@/app/hooks/useUserQuery';
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
import { ChevronLeft, Loader } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

function EditPage(context: { params: Promise<{ id: string }> }) {
  const { id } = React.use(context.params);
  const { user, isLoading } = useUserFindByIdQuery(id);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      course: '',
      studentID: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user?.name,
        course: user?.course,
        studentID: user?.studentId,
      });
    }
  }, [user, form]);

  const { updateUser, isUpdating } = useUserMutation();
  const onSave = (payload: userValues) => {
    if (user) {
      updateUser(
        { id, payload },
        {
          onSuccess: () => {
            toast.success('User updated');
            router.push(`/users`);
          },
        }
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <Link href={`/users`}>
              <div className="flex h-12 w-12 items-center rounded-full border hover:bg-gray-100">
                <ChevronLeft className="m-auto" />
              </div>
            </Link>
            <div className="text-2xl">Edit User</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormInput
          isLoading={isLoading}
          isSubmitting={isUpdating}
          form={form}
          onSubmit={onSave}
        />
      </CardContent>
    </Card>
  );
}

export default EditPage;

interface FormInputProps {
  form: UseFormReturn<userValues>;
  onSubmit: (payload: userValues) => void;
  isLoading?: boolean;
  isSubmitting: boolean;
}

const FormInput = ({
  form,
  onSubmit,
  isLoading,
  isSubmitting,
}: FormInputProps) => {
  if (isLoading) {
    return <Loader className="h-4 w-4 animate-spin" />;
  }
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
          {isSubmitting ? <Loader className="h-4 w-4 animate-spin" /> : 'Save'}
        </Button>
      </form>
    </Form>
  );
};
