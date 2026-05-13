'use client';

import Link from 'next/link';
import { ShieldAlert, Home } from 'lucide-react';
import { Button } from '@/components/Button';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-10 h-10 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold">Unauthorized Access</h1>
        <p className="text-muted-foreground">
          You do not have the required permissions to access this area. 
          Please contact your administrator if you believe this is an error.
        </p>
        <div className="pt-6">
          <Link href="/dashboard">
            <Button className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
