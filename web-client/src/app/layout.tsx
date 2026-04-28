import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'AppTimTho - Tìm thợ sửa chữa quanh bạn',
  description: 'Nền tảng kết nối thợ sửa chữa gia dụng, điện lạnh, ống nước với khách hàng nhanh chóng, uy tín.',
};

/**
 * Root Layout — Shell HTML cơ bản.
 * Mỗi Domain (customer, worker) tự có layout riêng với Header/Sidebar phù hợp.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
