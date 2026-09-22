import Link from 'next/link';
import TestimonialForm from '../../components/TestimonialForm';
import { ChevronRight } from 'lucide-react';

export default function NewTestimonialPage() {
  return (
    <div style={{ maxWidth: '680px', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--muted)' }}>
        <Link href="/admin/testimonials" style={{ color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 600 }}>Testimonials</Link>
        <ChevronRight size={14} />
        <span>New Testimonial</span>
      </div>
      <h1 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.9rem)', fontWeight: 800, color: 'var(--foreground)', margin: '0 0 0.35rem' }}>Add Testimonial</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Add a client review to build social proof on your portfolio.</p>
      <div className="card" style={{ padding: '1.75rem' }}>
        <TestimonialForm mode="new" />
      </div>
    </div>
  );
}
