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
import { Button } from '../../../components/ui/button';
import Image from 'next/image';
import { UserCircle } from 'lucide-react';
import useUserProfile from '@/features/auth/hooks/useUserProfile';
import { useLogout } from '@/features/auth/hooks/useLogout';
import Link from 'next/link';

export const UserButton = () => {
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
        <DropdownMenuLabel className="text-sm font-semibold">
          {user?.name ? (
            <>
              {user.name} <br />
              <span className="text-gray-500">@{user.username}</span>
            </>
          ) : (
            `@${user?.username ?? 'Unknown'}`
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <Link href={`/profile/setting`}>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </Link>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={Logout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
