'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { userProfileValues } from '@/app/schema/user.schema';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Github } from 'lucide-react';

interface ProfileSettingProps {
  form: UseFormReturn<userProfileValues>;
  handleUpdate: (action: userProfileValues) => void;
  githubUser?: boolean;
}

const ProfileSettings = ({
  form,
  handleUpdate,
  githubUser,
}: ProfileSettingProps) => {
  const isReadOnly = githubUser;
  const [showDialog, setShowDialog] = useState(false);

  const handleFieldFocus = () => {
    if (isReadOnly) {
      setShowDialog(true);
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUpdate)}
              className="mt-4 space-y-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        readOnly={isReadOnly}
                        onFocus={handleFieldFocus}
                      />
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
                      <Input
                        {...field}
                        type="text"
                        readOnly={isReadOnly}
                        onFocus={handleFieldFocus}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        readOnly={isReadOnly}
                        onFocus={handleFieldFocus}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isReadOnly}>Save</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <GithubAlert showDialog={showDialog} setShowDialog={setShowDialog} />
    </>
  );
};

export default ProfileSettings;

const GithubAlert = ({
  showDialog,
  setShowDialog,
}: {
  showDialog: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-md">
        <div className="flex items-center gap-4">
          <Github size={28} className="text-black" />
          <DialogTitle>Profile is Read-Only</DialogTitle>
        </div>
        <DialogDescription className="pt-2">
          Your profile is linked to GitHub and cannot be edited here. To update
          your information, visit your{' '}
          <a
            href="https://github.com/settings/profile"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            GitHub profile settings
          </a>
          .
        </DialogDescription>
        <DialogFooter className="sm:justify-end">
          <Button onClick={() => setShowDialog(false)}>Okay</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
