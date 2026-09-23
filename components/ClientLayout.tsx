'use client';

import { usePathname } from 'next/navigation';

interface ClientLayoutProps {
  navbar: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Navbar/Footer are rendered by the (server) root layout and passed in as nodes so Footer
 * can stay a Server Component (fetches site settings at render time, not client-side).
 * This client wrapper only decides whether to show them, based on the current route.
 */
export default function ClientLayout({ navbar, footer, children }: ClientLayoutProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdmin && navbar}
      <main className="flex-1">{children}</main>
      {!isAdmin && footer}
    </>
  );
}
