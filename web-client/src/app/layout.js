import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'TìmThợ - Nền tảng kết nối thợ sửa chữa',
  description: 'Nền tảng kết nối thợ sửa chữa gia dụng, điện lạnh, ống nước với khách hàng nhanh chóng, uy tín.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
