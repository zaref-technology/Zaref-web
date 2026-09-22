'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  addDoc, updateDoc, doc, collection, serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  CheckCircle, AlertTriangle, Loader2,
  Code2, Palette, Smartphone, Server, Globe, Zap, Shield, Wrench,
  Layers, Database, BarChart2, Brain, PenTool, CloudLightning, Star,
  MonitorSmartphone, Cpu, Package, LayoutTemplate,
} from 'lucide-react';

export interface ServiceData {
  id?: string;
  title: string;
  description: string;
  iconName: string;
  color: string;
  order: number;
}

const ICONS: { name: string; Icon: React.ComponentType<{ size?: number; color?: string }> }[] = [
  { name: 'Code2',          Icon: Code2 },
  { name: 'Palette',        Icon: Palette },
  { name: 'Smartphone',     Icon: Smartphone },
  { name: 'Server',         Icon: Server },
  { name: 'Globe',          Icon: Globe },
  { name: 'Zap',            Icon: Zap },
  { name: 'Shield',         Icon: Shield },
  { name: 'Wrench',         Icon: Wrench },
  { name: 'Layers',         Icon: Layers },
  { name: 'Database',       Icon: Database },
  { name: 'BarChart2',      Icon: BarChart2 },
  { name: 'Brain',          Icon: Brain },
  { name: 'PenTool',        Icon: PenTool },
  { name: 'CloudLightning', Icon: CloudLightning },
  { name: 'Star',           Icon: Star },
  { name: 'MonitorSmartphone', Icon: MonitorSmartphone },
  { name: 'Cpu',            Icon: Cpu },
  { name: 'Package',        Icon: Package },
  { name: 'LayoutTemplate', Icon: LayoutTemplate },
];

export const ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> =
  Object.fromEntries(ICONS.map(({ name, Icon }) => [name, Icon]));

const COLORS = [
  { label: 'Blue',   value: '#2563eb' },
  { label: 'Purple', value: '#7c3aed' },
  { label: 'Green',  value: '#059669' },
  { label: 'Amber',  value: '#d97706' },
  { label: 'Cyan',   value: '#0891b2' },
  { label: 'Pink',   value: '#db2777' },
  { label: 'Orange', value: '#ea580c' },
  { label: 'Red',    value: '#dc2626' },
];

interface ServiceFormProps {
  initialData?: ServiceData;
  mode: 'new' | 'edit';
  nextOrder?: number;
}

export default function ServiceForm({ initialData, mode, nextOrder = 0 }: ServiceFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ServiceData>({
    title:       initialData?.title       ?? '',
    description: initialData?.description ?? '',
    iconName:    initialData?.iconName    ?? 'Code2',
    color:       initialData?.color       ?? '#2563eb',
    order:       initialData?.order       ?? nextOrder,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);

  const set = (key: keyof ServiceData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required.'); return; }
    setLoading(true);
    setError('');
    try {
      if (mode === 'new') {
        await addDoc(collection(db, 'services'), {
          ...form,
          order: Number(form.order),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else if (mode === 'edit' && initialData?.id) {
        await updateDoc(doc(db, 'services', initialData.id), {
          ...form,
          order: Number(form.order),
          updatedAt: serverTimestamp(),
        });
      }
      setSuccess(true);
      setTimeout(() => router.push('/admin/services'), 1000);
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
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: 'var(--foreground)',
    marginBottom: '0.4rem',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  };

  const SelectedIcon = ICON_MAP[form.iconName] ?? Code2;

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Live Preview */}
      <div style={{
        padding: '1.25rem',
        background: `linear-gradient(135deg, ${form.color}10, ${form.color}05)`,
        border: `1.5px solid ${form.color}30`,
        borderRadius: '1rem',
        display: 'flex', alignItems: 'center', gap: '1rem',
      }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '14px', flexShrink: 0,
          background: `${form.color}18`, border: `1.5px solid ${form.color}35`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <SelectedIcon size={24} color={form.color} />
        </div>
        <div>
          <div style={{ fontWeight: 700, color: 'var(--foreground)', fontSize: '1rem' }}>
            {form.title || 'Service Title'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
            {form.description ? `${form.description.slice(0, 60)}${form.description.length > 60 ? '…' : ''}` : 'Service description will appear here'}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--muted)' }}>Preview</div>
      </div>

      {/* Title */}
      <div>
        <label style={labelStyle}>Service Title *</label>
        <input value={form.title} onChange={set('title')} placeholder="e.g. UI/UX Design" style={inputStyle} />
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle}>Description</label>
        <textarea
          value={form.description}
          onChange={set('description')}
          rows={3}
          placeholder="Briefly describe what this service offers..."
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      {/* Icon Picker */}
      <div>
        <label style={labelStyle}>Icon</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))', gap: '0.5rem' }}>
          {ICONS.map(({ name, Icon }) => (
            <button
              key={name}
              type="button"
              onClick={() => setForm(prev => ({ ...prev, iconName: name }))}
              title={name}
              style={{
                width: '48px', height: '48px',
                borderRadius: '10px',
                border: `2px solid ${form.iconName === name ? form.color : 'var(--border)'}`,
                background: form.iconName === name ? `${form.color}18` : 'var(--surface-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s',
                transform: form.iconName === name ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              <Icon size={20} color={form.iconName === name ? form.color : 'var(--muted)'} />
            </button>
          ))}
        </div>
      </div>

      {/* Accent Color */}
      <div>
        <label style={labelStyle}>Accent Color</label>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {COLORS.map(c => (
            <button
              key={c.value}
              type="button"
              onClick={() => setForm(prev => ({ ...prev, color: c.value }))}
              title={c.label}
              style={{
                width: '30px', height: '30px', borderRadius: '50%',
                background: c.value,
                border: form.color === c.value ? '3px solid var(--foreground)' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'transform 0.15s',
                transform: form.color === c.value ? 'scale(1.25)' : 'scale(1)',
                outline: 'none',
              }}
            />
          ))}
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
            {COLORS.find(c => c.value === form.color)?.label}
          </span>
        </div>
      </div>

      {/* Display Order */}
      <div style={{ maxWidth: '160px' }}>
        <label style={labelStyle}>Display Order</label>
        <input
          type="number"
          min={0}
          value={form.order}
          onChange={e => setForm(prev => ({ ...prev, order: Number(e.target.value) }))}
          style={inputStyle}
        />
      </div>

      {/* Error / Success */}
      {error && (
        <div style={{ padding: '0.75rem 1rem', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '0.65rem', color: '#ef4444', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={15} /> {error}
        </div>
      )}
      {success && (
        <div style={{ padding: '0.75rem 1rem', background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.3)', borderRadius: '0.65rem', color: '#10b981', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={15} /> Service saved! Redirecting…
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary"
        style={{ justifyContent: 'center', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
      >
        {loading
          ? <><Loader2 size={15} style={{ animation: 'spin 0.7s linear infinite' }} /> Saving…</>
          : mode === 'new' ? 'Add Service' : 'Save Changes'
        }
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}
