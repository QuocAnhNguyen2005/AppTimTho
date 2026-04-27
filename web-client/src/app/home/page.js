"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Route /home không còn dùng - redirect về /customer
export default function HomeRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/customer'); }, [router]);
  return null;
}
