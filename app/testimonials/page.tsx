'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Star, Quote, ArrowRight } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  avatar: string;
  order: number;
}

const initials = (name: string) =>
  name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const GRADIENT_COLORS = [
  'linear-gradient(135deg, #2563eb, #7c3aed)',
  'linear-gradient(135deg, #059669, #0891b2)',
  'linear-gradient(135deg, #d97706, #ea580c)',
  'linear-gradient(135deg, #db2777, #7c3aed)',
];

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const snap = await getDocs(query(collection(db, 'testimonials'), orderBy('order', 'asc')));
        setTestimonials(snap.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  return (
    <div style={{ paddingTop: '70px' }}>
      {/* Hero */}
      <section style={{ position: 'relative', padding: '6rem 0 5rem', overflow: 'hidden', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="glow-blob" style={{ width: '500px', height: '500px', background: 'var(--primary)', top: '-200px', left: '-100px' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="badge" style={{ margin: '0 auto 1rem' }}>Social Proof</div>
          <h1 className="section-title" style={{ margin: '0 auto 1rem' }}>What Clients Say</h1>
          <p className="section-subtitle" style={{ margin: '0 auto 2rem' }}>
            Real feedback from real people who trusted us with their projects.
          </p>
          <Link href="/contact" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            Work With Us <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Grid */}
      <section className="section">
        <div className="container">
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="card" style={{ height: '220px', animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
              <Quote size={48} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.3, color: 'var(--muted)' }} />
              <h2 style={{ fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.5rem' }}>No testimonials yet</h2>
              <p style={{ color: 'var(--muted)' }}>Check back soon!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {testimonials.map((t, idx) => (
                <div key={t.id} className="card" style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {/* Giant quote mark */}
                  <Quote size={40} style={{ position: 'absolute', top: '1rem', right: '1.25rem', opacity: 0.06, color: 'var(--foreground)' }} />

                  {/* Stars */}
                  <div style={{ display: 'flex', gap: '3px', marginBottom: '1rem' }}>
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={15} fill={i <= t.rating ? '#f59e0b' : 'none'} color={i <= t.rating ? '#f59e0b' : 'var(--border)'} />
                    ))}
                  </div>

                  {/* Quote */}
                  <p style={{ fontSize: '0.95rem', color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.75, flex: 1, margin: '0 0 1.5rem' }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                      background: t.avatar ? 'transparent' : GRADIENT_COLORS[idx % GRADIENT_COLORS.length],
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden', fontSize: '0.85rem', fontWeight: 700, color: '#fff',
                    }}>
                      {t.avatar
                        ? <img src={t.avatar} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : initials(t.name)
                      }
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--foreground)', fontSize: '0.95rem' }}>{t.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                        {[t.role, t.company].filter(Boolean).join(' · ')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '5rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem', color: 'var(--foreground)' }}>
            Ready to be the next <span style={{ color: 'var(--primary-light)' }}>success story?</span>
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: '2rem', fontSize: '1.05rem' }}>Let&apos;s build something great together.</p>
          <Link href="/contact" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            Start a Project <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
