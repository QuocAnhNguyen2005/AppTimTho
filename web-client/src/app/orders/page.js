"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Redirect /orders → /customer/orders
export default function OrdersRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/customer/orders'); }, [router]);
  return null;
}
