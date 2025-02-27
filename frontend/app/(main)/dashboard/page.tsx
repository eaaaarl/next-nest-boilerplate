'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/lib/context/state/authContext';
import React from 'react';

const Page = () => {
  const { user, isAuthenticated } = useAuth();
  return (
    <div className="space-y-6 p-4">
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Auth Status</h3>
            </div>
            <div className="m-auto flex">
              {isAuthenticated && (
                <pre className="mt-2 max-w-5xl overflow-x-auto rounded-md bg-gray-100 p-2 text-sm">
                  {JSON.stringify(user, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
