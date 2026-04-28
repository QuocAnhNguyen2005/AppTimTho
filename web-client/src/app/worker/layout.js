"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import WorkerSidebar from '@/components/worker/WorkerSidebar';

export default function WorkerLayout({ children }) {
  const pathname = usePathname();

  // Bỏ qua Sidebar nếu đang ở trang chủ giới thiệu thợ (/worker)
  if (pathname === '/worker') {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      {/* Cột điều hướng bên trái, giữ nguyên không bị load lại */}
      <aside style={{ width: '280px', backgroundColor: 'white', borderRight: '1px solid var(--border-color)', position: 'sticky', top: 0, height: '100vh' }}>
         <WorkerSidebar />
      </aside>

      {/* Khu vực nội dung thay đổi theo đường dẫn */}
      <main style={{ flex: 1, padding: '40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {children} 
        </div>
      </main>
    </div>
  );
}
