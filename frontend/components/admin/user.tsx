'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { useUserQuery } from '@/app/hooks/useUserQuery';
import { useAuthMutation } from '@/app/hooks/useAuthMutation';
import Image from 'next/image';
import { Loader } from 'lucide-react';

export const User = () => {
  const { isLoadingProfile, user } = useUserQuery();
  const { logout } = useAuthMutation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          {isLoadingProfile ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Image
                src={user?.avatar}
                alt="User avatar"
                width={32}
                height={32}
                className="h-full w-full rounded-full object-cover"
              />
              <span className="sr-only">Toggle user menu</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {isLoadingProfile ? 'Loading...' : user?.name || 'Guest'}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout(undefined)}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
