'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Layers, ArrowRight } from 'lucide-react';
import { ICON_MAP } from '@/app/services/components/ServicePageIcons';

interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  color: string;
  order: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const snap = await getDocs(query(collection(db, 'services'), orderBy('order', 'asc')));
        setServices(snap.docs.map(d => ({ id: d.id, ...d.data() } as Service)));
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
        <div className="glow-blob" style={{ width: '500px', height: '500px', background: 'var(--primary)', top: '-200px', right: '-100px' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="badge" style={{ margin: '0 auto 1rem' }}>What We Do</div>
          <h1 className="section-title" style={{ margin: '0 auto 1rem' }}>Services We Offer</h1>
          <p className="section-subtitle" style={{ margin: '0 auto 2rem' }}>
            End-to-end digital solutions tailored to your goals — from concept to launch and beyond.
          </p>
          <Link href="/contact" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            Start a Project <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section">
        <div className="container">
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="card" style={{ height: '180px', animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          ) : services.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
              <Layers size={48} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.3, color: 'var(--muted)' }} />
              <h2 style={{ fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.5rem' }}>No services listed yet</h2>
              <p style={{ color: 'var(--muted)' }}>Check back soon!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {services.map(svc => {
                const Icon = ICON_MAP[svc.iconName] ?? Layers;
                return (
                  <div key={svc.id} className="card" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                    {/* Glow accent */}
                    <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', borderRadius: '50%', background: `${svc.color}15`, filter: 'blur(20px)', pointerEvents: 'none' }} />
                    <div style={{ width: '54px', height: '54px', borderRadius: '14px', background: `${svc.color}18`, border: `1.5px solid ${svc.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                      <Icon size={26} color={svc.color} />
                    </div>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.6rem' }}>{svc.title}</h2>
                    <p style={{ fontSize: '0.925rem', color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>{svc.description}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '5rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem', color: 'var(--foreground)' }}>
            Ready to build something <span style={{ color: 'var(--primary-light)' }}>amazing?</span>
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: '2rem', fontSize: '1.05rem' }}>
            Let&apos;s turn your idea into a stunning digital product.
          </p>
          <Link href="/contact" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            Start a Project <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
