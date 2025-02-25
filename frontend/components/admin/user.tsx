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
import Image from 'next/image';
import { Loader, UserCircle } from 'lucide-react';
import { useAuth } from '@/app/(main)/SessionProvider';

export const User = () => {
  const { isLoadingProfile, user } = useUserQuery();
  const { logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          {isLoadingProfile ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <>
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
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {isLoadingProfile ? 'Loading...' : (user?.name ?? user?.username)}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
