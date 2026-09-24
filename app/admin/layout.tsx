import type { Metadata } from 'next';
import AdminLayoutClient from './AdminLayoutClient';

// Server layout whose only job is to own metadata (the client shell can't export it). Every
// /admin route is non-indexable and must not inherit the public homepage's canonical/OG data —
// Next replaces (not merges) `alternates`/`openGraph`/`twitter` when a segment declares its own.
export const metadata: Metadata = {
  title: 'Admin',
  description: 'Zaref administration.',
  alternates: {},
  openGraph: { title: 'Admin', description: 'Zaref administration.', images: [] },
  twitter: { title: 'Admin', description: 'Zaref administration.', images: [] },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
