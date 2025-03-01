'use client';
import { userProfileSchema, userProfileValues } from '@/app/schema/user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import useUserProfile from './useUserProfile';
import { useEffect } from 'react';
import { useUpdateProfileMutation } from '../query/authMutation';
import { toast } from 'sonner';

export const useUserProfileSetting = () => {
  const { user } = useUserProfile();

  const form = useForm({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      email: '',
      name: '',
      username: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        email: user.email ?? '',
        name: user.name ?? '',
        username: user.username ?? '',
      });
    }
  }, [user, form]);
  const { IsUpdatingProfileUser, updateProfileUser } =
    useUpdateProfileMutation();

  const handleUpdate = (action: userProfileValues) => {
    if (user) {
      updateProfileUser(
        { id: user.id, payload: action },
        {
          onSuccess: () => {
            toast.success('Profile updated.');
          },
        }
      );
    }
  };

  return {
    form,
    handleUpdate,
    IsUpdatingProfileUser,
  };
};
