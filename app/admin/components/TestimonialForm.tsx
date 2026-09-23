'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { createTestimonial, updateTestimonial } from '@/services/testimonials.service';
import {
  CheckCircle, AlertTriangle, Loader2, Star, Upload, X,
} from 'lucide-react';
import type { TestimonialInput } from '@/types/testimonial';
import { initialsFromName } from '@/constants/testimonial';
import { triggerRevalidate } from '@/lib/revalidate';

/** Form state shape — a TestimonialInput plus an optional id, present only in edit mode. */
export type TestimonialFormData = TestimonialInput & { id?: string };

interface TestimonialFormProps {
  initialData?: TestimonialFormData;
  mode: 'new' | 'edit';
  nextOrder?: number;
}

export default function TestimonialForm({ initialData, mode, nextOrder = 0 }: TestimonialFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<TestimonialFormData>({
    name:    initialData?.name    ?? '',
    role:    initialData?.role    ?? '',
    company: initialData?.company ?? '',
    quote:   initialData?.quote   ?? '',
    rating:  initialData?.rating  ?? 5,
    avatar:  initialData?.avatar  ?? '',
    order:   initialData?.order   ?? nextOrder,
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState(false);

  const set = (key: keyof TestimonialFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setForm(prev => ({ ...prev, avatar: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Avatar upload failed.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Name is required.'); return; }
    if (!form.quote.trim()) { setError('Quote is required.'); return; }
    setLoading(true);
    setError('');
    try {
      if (mode === 'new') {
        await createTestimonial(form);
      } else if (mode === 'edit' && initialData?.id) {
        await updateTestimonial(initialData.id, form);
      }
      await triggerRevalidate([{ path: '/' }, { path: '/testimonials' }]);
      setSuccess(true);
      setTimeout(() => router.push('/admin/testimonials'), 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'var(--surface-2)',
    border: '1.5px solid var(--border)',
    borderRadius: '0.65rem',
    color: 'var(--foreground)',
    fontSize: '0.95rem',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.78rem', fontWeight: 700,
    color: 'var(--foreground)', marginBottom: '0.4rem',
    textTransform: 'uppercase', letterSpacing: '0.06em',
  };

  // Avatar initials fallback
  const initials = form.name ? initialsFromName(form.name) : '?';

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Live Preview Card */}
      <div style={{
        padding: '1.5rem',
        background: 'var(--surface-2)',
        border: '1.5px solid var(--border)',
        borderRadius: '1rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(37,99,235,0.08)', filter: 'blur(15px)', pointerEvents: 'none' }} />
        {/* Stars */}
        <div style={{ display: 'flex', gap: '3px', marginBottom: '0.75rem' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <Star key={i} size={14} fill={i <= form.rating ? '#f59e0b' : 'none'} color={i <= form.rating ? '#f59e0b' : 'var(--border)'} />
          ))}
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.7, margin: '0 0 1rem' }}>
          &ldquo;{form.quote || 'Your testimonial quote will appear here…'}&rdquo;
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '50%',
            background: form.avatar ? 'transparent' : 'linear-gradient(135deg, #2563eb, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', flexShrink: 0, fontSize: '0.8rem', fontWeight: 700, color: '#fff',
          }}>
            {form.avatar
              ? <img src={form.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : initials}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--foreground)', fontSize: '0.9rem' }}>
              {form.name || 'Client Name'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
              {[form.role, form.company].filter(Boolean).join(' · ') || 'Role · Company'}
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', fontSize: '0.65rem', color: 'var(--muted)' }}>Preview</div>
      </div>

      {/* Avatar Upload */}
      <div>
        <label style={labelStyle}>Client Photo (optional)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: form.avatar ? 'transparent' : 'linear-gradient(135deg, #2563eb, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', flexShrink: 0, fontSize: '1rem', fontWeight: 700, color: '#fff',
          }}>
            {form.avatar
              ? <img src={form.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : initials}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <label style={{
              padding: '0.5rem 1rem', cursor: 'pointer',
              background: 'var(--surface-2)', border: '1.5px solid var(--border)',
              borderRadius: '0.65rem', fontSize: '0.85rem', fontWeight: 600,
              color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '0.4rem',
              transition: 'all 0.2s',
            }}>
              {uploading
                ? <><Loader2 size={13} style={{ animation: 'spin 0.7s linear infinite' }} /> Uploading…</>
                : <><Upload size={13} /> Upload Photo</>
              }
              <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} disabled={uploading} />
            </label>
            {form.avatar && (
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, avatar: '' }))}
                style={{ padding: '0.5rem 0.85rem', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '0.65rem', color: '#ef4444', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'inherit' }}
              >
                <X size={12} /> Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Name */}
      <div>
        <label style={labelStyle}>Client Name *</label>
        <input value={form.name} onChange={set('name')} placeholder="e.g. Sarah Johnson" style={inputStyle} />
      </div>

      {/* Role + Company row */}
      <div className="admin-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Role / Title</label>
          <input value={form.role} onChange={set('role')} placeholder="e.g. CEO" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Company</label>
          <input value={form.company} onChange={set('company')} placeholder="e.g. Acme Corp" style={inputStyle} />
        </div>
      </div>

      {/* Quote */}
      <div>
        <label style={labelStyle}>Testimonial Quote *</label>
        <textarea
          value={form.quote}
          onChange={set('quote')}
          rows={4}
          placeholder="What did the client say about working with you?"
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      {/* Star Rating */}
      <div>
        <label style={labelStyle}>Rating</label>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <button
              key={i}
              type="button"
              onClick={() => setForm(prev => ({ ...prev, rating: i }))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', transition: 'transform 0.15s' }}
            >
              <Star
                size={28}
                fill={i <= form.rating ? '#f59e0b' : 'none'}
                color={i <= form.rating ? '#f59e0b' : 'var(--border)'}
                style={{ transition: 'all 0.15s' }}
              />
            </button>
          ))}
          <span style={{ fontSize: '0.85rem', color: 'var(--muted)', marginLeft: '0.25rem' }}>
            {form.rating}/5
          </span>
        </div>
      </div>

      {/* Display Order */}
      <div style={{ maxWidth: '160px' }}>
        <label style={labelStyle}>Display Order</label>
        <input
          type="number" min={0}
          value={form.order}
          onChange={e => setForm(prev => ({ ...prev, order: Number(e.target.value) }))}
          style={inputStyle}
        />
      </div>

      {error && (
        <div style={{ padding: '0.75rem 1rem', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '0.65rem', color: '#ef4444', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={15} /> {error}
        </div>
      )}
      {success && (
        <div style={{ padding: '0.75rem 1rem', background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.3)', borderRadius: '0.65rem', color: '#10b981', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={15} /> Testimonial saved! Redirecting…
        </div>
      )}

      <button
        type="submit"
        disabled={loading || uploading}
        className="btn-primary"
        style={{ justifyContent: 'center', opacity: loading || uploading ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
      >
        {loading
          ? <><Loader2 size={15} style={{ animation: 'spin 0.7s linear infinite' }} /> Saving…</>
          : mode === 'new' ? 'Add Testimonial' : 'Save Changes'
        }
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}
