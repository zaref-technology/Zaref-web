'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  collection, getDocs, deleteDoc, doc, orderBy, query, Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Plus, Pencil, Trash2, Quote, Star, ArrowUpDown } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  avatar: string;
  order: number;
  createdAt: Timestamp | null;
}

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading]           = useState(true);
  const [deleting, setDeleting]         = useState<string | null>(null);
  const [confirmId, setConfirmId]       = useState<string | null>(null);

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

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      setTestimonials(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
      setConfirmId(null);
    }
  };

  const initials = (name: string) =>
    name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', fontWeight: 800, color: 'var(--foreground)', margin: '0 0 0.35rem' }}>Testimonials</h1>
          <p style={{ color: 'var(--muted)', margin: 0, fontSize: '0.9rem' }}>
            {testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''} · ordered by display order
          </p>
        </div>
        <Link href="/admin/testimonials/new" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <Plus size={16} /> Add Testimonial
        </Link>
      </div>

      {/* Tip */}
      <div style={{ padding: '0.75rem 1rem', background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '0.65rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowUpDown size={14} color="var(--primary-light)" />
        Change the <strong style={{ color: 'var(--foreground)' }}>Display Order</strong> number on each testimonial to control its position.
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: '90px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.85rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Quote size={48} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.3, color: 'var(--muted)' }} />
          <h2 style={{ fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.5rem' }}>No testimonials yet</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Add your first client testimonial to build social proof.</p>
          <Link href="/admin/testimonials/new" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={16} /> Add First Testimonial
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {testimonials.map(t => (
            <div key={t.id} className="card" style={{ padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {/* Order badge */}
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: 'var(--muted)', flexShrink: 0 }}>
                {t.order}
              </div>

              {/* Avatar */}
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
                background: t.avatar ? 'transparent' : 'linear-gradient(135deg, #2563eb, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', fontSize: '0.8rem', fontWeight: 700, color: '#fff',
              }}>
                {t.avatar
                  ? <img src={t.avatar} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : initials(t.name)
                }
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--foreground)', fontSize: '0.95rem' }}>{t.name}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                    {[t.role, t.company].filter(Boolean).join(' · ')}
                  </span>
                </div>
                {/* Stars */}
                <div style={{ display: 'flex', gap: '2px', marginBottom: '0.2rem' }}>
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={11} fill={i <= t.rating ? '#f59e0b' : 'none'} color={i <= t.rating ? '#f59e0b' : 'var(--border)'} />
                  ))}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontStyle: 'italic' }}>
                  &ldquo;{t.quote}&rdquo;
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <Link
                  href={`/admin/testimonials/${t.id}/edit`}
                  style={{ padding: '0.45rem 0.9rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '0.6rem', color: 'var(--foreground)', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', transition: 'all 0.2s' }}
                >
                  <Pencil size={12} /> Edit
                </Link>
                {confirmId === t.id ? (
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => handleDelete(t.id)} disabled={deleting === t.id} style={{ padding: '0.45rem 0.85rem', background: '#dc2626', border: 'none', borderRadius: '0.6rem', color: '#fff', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                      {deleting === t.id ? '…' : 'Confirm'}
                    </button>
                    <button onClick={() => setConfirmId(null)} style={{ padding: '0.45rem 0.85rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: '0.6rem', color: 'var(--muted)', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmId(t.id)} style={{ padding: '0.45rem 0.65rem', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '0.6rem', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
