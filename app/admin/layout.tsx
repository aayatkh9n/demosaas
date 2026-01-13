'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminNavbar from '@/components/admin/AdminNavbar';

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect if on login page
    if (pathname === '/admin/login') {
      return;
    }

    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Show login page without navbar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Protect admin routes
  if (!isAuthenticated) {
    return null;
  }

  // Show admin layout with navbar
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      {children}
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  );
}



