'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const AnalyticsClient = dynamic(() => import('./analytics-client'), {
  ssr: false,
});

export default function AnalyticsPage() {
  return (
    <Suspense fallback={
      <div className="space-y-8 animate-pulse">
        <div className="h-20 bg-white/5 rounded-2xl w-1/3 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2].map(i => <div key={i} className="h-[400px] bg-white/5 rounded-2xl" />)}
        </div>
      </div>
    }>
      <AnalyticsClient />
    </Suspense>
  );
}
