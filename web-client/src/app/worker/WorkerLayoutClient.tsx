"use client";

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import WorkerSidebar from '@/components/worker/WorkerSidebar';

export default function WorkerLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/worker') {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      <aside style={{
        width: '280px',
        backgroundColor: 'white',
        borderRight: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto'
      }}>
        <WorkerSidebar />
      </aside>
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
