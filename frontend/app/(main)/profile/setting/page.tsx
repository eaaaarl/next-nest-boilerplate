'use client';

import ProfileSettings from '@/features/auth/components/ProfileSettings';
import useUserProfile from '@/features/auth/hooks/useUserProfile';
import { useUserProfileSetting } from '@/features/auth/hooks/useUserProfileSetting';
import React from 'react';

const Setting = () => {
  const { form, handleUpdate, IsUpdatingProfileUser } = useUserProfileSetting();
  const { user } = useUserProfile();
  return (
    <ProfileSettings
      githubUser={!!user?.providerId}
      form={form}
      handleUpdate={handleUpdate}
      IsUpdatingProfile={IsUpdatingProfileUser}
    />
  );
};

export default Setting;
