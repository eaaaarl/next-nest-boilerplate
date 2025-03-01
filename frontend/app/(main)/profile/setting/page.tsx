'use client';

import ProfileSettings from '@/features/auth/components/ProfileSettings';
import useUserProfile from '@/features/auth/hooks/useUserProfile';
import { useUserProfileSetting } from '@/features/auth/hooks/useUserProfileSetting';
import React from 'react';

const Setting = () => {
  const { form, handleUpdate } = useUserProfileSetting();
  const { user } = useUserProfile();
  return (
    <div>
      <ProfileSettings
        githubUser={!!user?.providerId}
        form={form}
        handleUpdate={handleUpdate}
      />
    </div>
  );
};

export default Setting;
