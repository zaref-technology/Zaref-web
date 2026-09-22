'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  collection, getDocs, deleteDoc, doc, orderBy, query, Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Plus, Pencil, Trash2, Layers, ArrowUpDown } from 'lucide-react';
import { ICON_MAP } from '../components/ServiceForm';

interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  color: string;
  order: number;
  createdAt: Timestamp | null;
}

export default function ServicesAdminPage() {
  const [services, setServices]   = useState<Service[]>([]);
  const [loading, setLoading]     = useState(true);
  const [deleting, setDeleting]   = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

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

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await deleteDoc(doc(db, 'services', id));
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
      setConfirmId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', fontWeight: 800, color: 'var(--foreground)', margin: '0 0 0.35rem' }}>Services</h1>
          <p style={{ color: 'var(--muted)', margin: 0, fontSize: '0.9rem' }}>
            {services.length} service{services.length !== 1 ? 's' : ''} · ordered by display order
          </p>
        </div>
        <Link href="/admin/services/new" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <Plus size={16} /> Add Service
        </Link>
      </div>

      {/* Tip */}
      <div style={{ padding: '0.75rem 1rem', background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '0.65rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowUpDown size={14} color="var(--primary-light)" />
        Change the <strong style={{ color: 'var(--foreground)' }}>Display Order</strong> number on each service to control its position on the site.
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: '80px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.85rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Layers size={48} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.3, color: 'var(--muted)' }} />
          <h2 style={{ fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.5rem' }}>No services yet</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Add your first service to showcase what you offer.</p>
          <Link href="/admin/services/new" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={16} /> Add First Service
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {services.map(svc => {
            const Icon = ICON_MAP[svc.iconName] ?? Layers;
            return (
              <div
                key={svc.id}
                className="card"
                style={{ padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}
              >
                {/* Order badge */}
                <div style={{
                  width: '28px', height: '28px', borderRadius: '8px',
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 800, color: 'var(--muted)',
                  flexShrink: 0,
                }}>
                  {svc.order}
                </div>

                {/* Icon */}
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                  background: `${svc.color}18`, border: `1.5px solid ${svc.color}35`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={20} color={svc.color} />
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: 'var(--foreground)', fontSize: '0.95rem' }}>{svc.title}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {svc.description || 'No description'}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <Link
                    href={`/admin/services/${svc.id}/edit`}
                    style={{
                      padding: '0.45rem 0.9rem',
                      background: 'var(--surface-2)', border: '1px solid var(--border)',
                      borderRadius: '0.6rem', color: 'var(--foreground)', fontSize: '0.82rem',
                      fontWeight: 600, textDecoration: 'none',
                      display: 'flex', alignItems: 'center', gap: '0.3rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Pencil size={12} /> Edit
                  </Link>

                  {confirmId === svc.id ? (
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => handleDelete(svc.id)}
                        disabled={deleting === svc.id}
                        style={{ padding: '0.45rem 0.85rem', background: '#dc2626', border: 'none', borderRadius: '0.6rem', color: '#fff', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        {deleting === svc.id ? '…' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        style={{ padding: '0.45rem 0.85rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: '0.6rem', color: 'var(--muted)', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(svc.id)}
                      style={{ padding: '0.45rem 0.65rem', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '0.6rem', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
