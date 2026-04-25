"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-header shadow-sm' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            T
          </div>
          <span className={`font-bold text-2xl tracking-tight ${scrolled ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white'}`}>
            Tìm<span className="text-indigo-600 dark:text-indigo-400">Thợ</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link 
            href="/customer" 
            className={`font-medium transition-colors hover:text-indigo-600 ${pathname.startsWith('/customer') ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-300'}`}
          >
            Tìm dịch vụ
          </Link>
          <Link 
            href="/worker" 
            className={`font-medium transition-colors hover:text-indigo-600 ${pathname.startsWith('/worker') ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-300'}`}
          >
            Dành cho thợ
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <button className="font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors">
            Đăng nhập
          </button>
          <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
            Đăng ký
          </button>
        </div>

        <button className="md:hidden text-slate-600 dark:text-slate-300">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
