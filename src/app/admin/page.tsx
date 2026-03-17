'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const DashboardClient = dynamic(() => import('./dashboard-client'), {
  ssr: false,
});

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="space-y-8 animate-pulse">
        <div className="h-10 bg-white/5 rounded-xl w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl" />)}
        </div>
      </div>
    }>
      <DashboardClient />
    </Suspense>
  );
}
