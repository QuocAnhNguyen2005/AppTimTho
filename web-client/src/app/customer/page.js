"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Redirect /customer → /customer/home
export default function CustomerRoot() {
  const router = useRouter();
  useEffect(() => { router.replace('/customer/home'); }, [router]);
  return null;
}
