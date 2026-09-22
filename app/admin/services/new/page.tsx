import Link from 'next/link';
import ServiceForm from '../../components/ServiceForm';
import { ChevronRight } from 'lucide-react';

export default function NewServicePage() {
  return (
    <div style={{ maxWidth: '680px', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--muted)' }}>
        <Link href="/admin/services" style={{ color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 600 }}>Services</Link>
        <ChevronRight size={14} />
        <span>New Service</span>
      </div>
      <h1 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.9rem)', fontWeight: 800, color: 'var(--foreground)', margin: '0 0 0.35rem' }}>Add New Service</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Fill in the details below to add a service to your portfolio.
      </p>
      <div className="card" style={{ padding: '1.75rem' }}>
        <ServiceForm mode="new" />
      </div>
    </div>
  );
}
