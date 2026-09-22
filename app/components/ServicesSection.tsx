'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
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

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const snap = await getDocs(
          query(collection(db, 'services'), orderBy('order', 'asc'), limit(4))
        );
        setServices(snap.docs.map(d => ({ id: d.id, ...d.data() } as Service)));
      } catch (err) {
        console.error('ServicesSection fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  return (
    <section className="section">
      <style>{`
        .services-scroll-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 900px) {
          .services-scroll-row {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 1rem;
            gap: 1rem;
          }
          .services-scroll-row::-webkit-scrollbar { height: 4px; }
          .services-scroll-row::-webkit-scrollbar-track { background: transparent; }
          .services-scroll-row::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
        }
        .service-card-wrap {
          flex: 0 0 260px;
          scroll-snap-align: start;
        }
        @media (min-width: 901px) {
          .service-card-wrap {
            flex: unset;
          }
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      <div className="container">
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
          <div>
            <div className="badge" style={{ marginBottom: '0.75rem' }}>What We Do</div>
            <h2 className="section-title" style={{ margin: 0 }}>Services We Offer</h2>
            <p className="section-subtitle" style={{ margin: '0.5rem 0 0', maxWidth: '480px' }}>
              End-to-end solutions tailored to your goals — from concept to launch.
            </p>
          </div>
          <Link
            href="/services"
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

        {/* Cards Row */}
        {loading ? (
          <div className="services-scroll-row">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="service-card-wrap">
                <div className="card" style={{ height: '180px', animation: 'pulse 1.5s ease-in-out infinite' }} />
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--muted)' }}>
            <Layers size={36} style={{ margin: '0 auto 0.75rem', display: 'block', opacity: 0.3 }} />
            <p>No services yet — add them from the admin panel.</p>
          </div>
        ) : (
          <div className="services-scroll-row">
            {services.map(svc => {
              const Icon = ICON_MAP[svc.iconName] ?? Layers;
              return (
                <div key={svc.id} className="service-card-wrap">
                  <div
                    className="card"
                    style={{ padding: '1.75rem', height: '100%', position: 'relative', overflow: 'hidden', boxSizing: 'border-box' }}
                  >
                    {/* Glow accent */}
                    <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '90px', height: '90px', borderRadius: '50%', background: `${svc.color}15`, filter: 'blur(20px)', pointerEvents: 'none' }} />
                    {/* Icon */}
                    <div style={{
                      width: '50px', height: '50px', borderRadius: '13px',
                      background: `${svc.color}18`, border: `1.5px solid ${svc.color}35`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '1.1rem',
                    }}>
                      <Icon size={24} color={svc.color} />
                    </div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.5rem' }}>
                      {svc.title}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
                      {svc.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mobile "View All" link below cards */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link
            href="/services"
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
          >
            View All Services <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
