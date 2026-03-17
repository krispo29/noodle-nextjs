'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const LayoutClient = dynamic(() => import('./layout-client'), {
  ssr: false,
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    }>
      <LayoutClient>{children}</LayoutClient>;
    </Suspense>
  );
}
