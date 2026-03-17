'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const LoginClient = dynamic(() => import('./login-client'), {
  ssr: false,
});

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    }>
      <LoginClient />
    </Suspense>
  );
}
