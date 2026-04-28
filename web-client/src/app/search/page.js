"use client";
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
// Redirect /search → /customer/search (giữ query params)
function SearchRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const q = searchParams.get('q');
    router.replace(q ? `/customer/search?q=${encodeURIComponent(q)}` : '/customer/search');
  }, [router, searchParams]);
  return null;
}
export default function SearchRedirect() {
  return <Suspense><SearchRedirectContent /></Suspense>;
}
