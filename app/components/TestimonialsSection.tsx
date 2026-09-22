'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
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

const GRADIENTS = [
  'linear-gradient(135deg, #2563eb, #7c3aed)',
  'linear-gradient(135deg, #059669, #0891b2)',
  'linear-gradient(135deg, #d97706, #ea580c)',
  'linear-gradient(135deg, #db2777, #7c3aed)',
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const snap = await getDocs(
          query(collection(db, 'testimonials'), orderBy('order', 'asc'), limit(4))
        );
        setTestimonials(snap.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial)));
      } catch (err) {
        console.error('TestimonialsSection fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  return (
    <section className="section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
      <style>{`
        .testimonials-scroll-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 900px) {
          .testimonials-scroll-row {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 1rem;
            gap: 1rem;
          }
          .testimonials-scroll-row::-webkit-scrollbar { height: 4px; }
          .testimonials-scroll-row::-webkit-scrollbar-track { background: transparent; }
          .testimonials-scroll-row::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
        }
        .testimonial-card-wrap {
          flex: 0 0 280px;
          scroll-snap-align: start;
        }
        @media (min-width: 901px) {
          .testimonial-card-wrap { flex: unset; }
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      <div className="container">
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
          <div>
            <div className="badge" style={{ marginBottom: '0.75rem' }}>Social Proof</div>
            <h2 className="section-title" style={{ margin: 0 }}>What Clients Say</h2>
            <p className="section-subtitle" style={{ margin: '0.5rem 0 0', maxWidth: '480px' }}>
              Real feedback from people who trusted us with their projects.
            </p>
          </div>
          <Link
            href="/testimonials"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.6rem 1.25rem',
              border: '1.5px solid var(--border)',
              borderRadius: '999px',
              color: 'var(--foreground)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              background: 'transparent',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="testimonials-scroll-row">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="testimonial-card-wrap">
                <div className="card" style={{ height: '220px', animation: 'pulse 1.5s ease-in-out infinite' }} />
              </div>
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--muted)' }}>
            <Quote size={36} style={{ margin: '0 auto 0.75rem', display: 'block', opacity: 0.3 }} />
            <p>No testimonials yet — add them from the admin panel.</p>
          </div>
        ) : (
          <div className="testimonials-scroll-row">
            {testimonials.map((t, idx) => (
              <div key={t.id} className="testimonial-card-wrap">
                <div className="card" style={{ padding: '1.75rem', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', boxSizing: 'border-box' }}>
                  {/* Decorative quote mark */}
                  <Quote size={36} style={{ position: 'absolute', top: '1rem', right: '1rem', opacity: 0.05, color: 'var(--foreground)' }} />

                  {/* Stars */}
                  <div style={{ display: 'flex', gap: '3px', marginBottom: '1rem' }}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} size={14} fill={i <= t.rating ? '#f59e0b' : 'none'} color={i <= t.rating ? '#f59e0b' : 'var(--border)'} />
                    ))}
                  </div>

                  {/* Quote */}
                  <p style={{
                    fontSize: '0.9rem', color: 'var(--muted)', fontStyle: 'italic',
                    lineHeight: 1.75, flex: 1, margin: '0 0 1.25rem',
                    display: '-webkit-box', WebkitLineClamp: 5,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                      background: t.avatar ? 'transparent' : GRADIENTS[idx % GRADIENTS.length],
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden', fontSize: '0.78rem', fontWeight: 700, color: '#fff',
                    }}>
                      {t.avatar
                        ? <img src={t.avatar} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : initials(t.name)
                      }
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--foreground)', fontSize: '0.88rem' }}>{t.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                        {[t.role, t.company].filter(Boolean).join(' · ')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}


      </div>
    </section>
  );
}
