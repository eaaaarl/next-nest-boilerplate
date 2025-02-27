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
import Image from 'next/image';
import { Loader, UserCircle } from 'lucide-react';
import useUserProfile from '@/features/auth/hooks/useUserProfile';
import { useLogout } from '@/features/auth/hooks/useLogout';

export const User = () => {
  const { user } = useUserProfile();
  const { Logout } = useLogout();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          {user?.avatar ? (
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
          ) : (
            <UserCircle />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{user?.name ?? user?.username}</DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={Logout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
