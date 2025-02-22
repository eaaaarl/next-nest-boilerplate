'use client';

import { useUserMutation } from '@/app/hooks/useUserMutation';
import { useUserListQuery } from '@/app/hooks/useUserQuery';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Ellipsis, Eye, Loader, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'sonner';

function UserPages() {
  const [userId, setUserId] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const { isLoading, users } = useUserListQuery();
  const { deleteUser } = useUserMutation();
  const handleDelete = async (id: string) => {
    setUserId(id);
    setOpenDeleteDialog(true);
  };
  const confirmDelete = () => {
    if (userId) {
      deleteUser(userId, {
        onSuccess: () => {
          toast.success('User deleted.');
          setOpenDeleteDialog(false);
          setUserId(null);
        },
      });
    }
  };
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="items-center space-y-6 p-4">
          <Link href={`/users/add`}>
            <Button>
              <PlusCircle className="h-4 w-4" />
              Add User
            </Button>
          </Link>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>List of User's</CardTitle>
        </CardHeader>
        <CardContent>
          <UserTable
            onDelete={(id) => handleDelete(id)}
            isLoading={isLoading}
            users={users ?? []}
          />
        </CardContent>
      </Card>

      <ConfirmDeleteDialog
        onDelete={confirmDelete}
        onOpenChange={() => setOpenDeleteDialog(false)}
        isOpen={openDeleteDialog}
      />
    </div>
  );
}

export default UserPages;

interface usersProps {
  users: any[];
  isLoading: boolean;
  onDelete: (id: string) => {};
}

function UserTable({ users, isLoading, onDelete }: usersProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Course</TableHead>
          <TableHead className="sr-only">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={3}>
              <Loader className="h-4 w-4 animate-spin" />
            </TableCell>
          </TableRow>
        ) : (
          users.map((user, i) => (
            <TableRow key={i}>
              <TableCell>{user.studentId}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.course}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={'ghost'}>
                      <Ellipsis />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Eye className="text-blue-700" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onDelete(user?.id)}>
                      <Trash2 className="text-red-700" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
