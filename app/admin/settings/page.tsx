'use client';

import { useEffect, useState } from 'react';
import { getSiteSettings, saveSiteSettings } from '@/services/settings.service';
import { triggerRevalidate } from '@/lib/revalidate';
import type { SiteSettings } from '@/types/settings';
import {
  Mail, Phone, MessageCircle, MapPin, Globe2,
  CheckCircle, AlertTriangle, Loader2, Save, Type, Tag,
} from 'lucide-react';
import { SOCIAL_PLATFORMS } from '@/constants/social';
import type { IconComponent } from '@/constants/service';

type Field = {
  key: keyof SiteSettings;
  label: string;
  placeholder: string;
  icon: IconComponent;
};

const SECTIONS: { title: string; fields: Field[] }[] = [
  {
    title: 'Branding',
    fields: [
      { key: 'siteName', label: 'Site Name', placeholder: 'Zaref', icon: Type },
      { key: 'tagline',  label: 'Tagline',   placeholder: 'Technology built to move forward.', icon: Tag },
    ],
  },
  {
    title: 'Contact Information',
    fields: [
      { key: 'email',    label: 'Email Address', placeholder: 'hello@zaref.in',          icon: Mail         },
      { key: 'phone',    label: 'Phone Number',  placeholder: '+1 234 567 8900',         icon: Phone        },
      { key: 'whatsapp', label: 'WhatsApp',      placeholder: '+1 234 567 8900',         icon: MessageCircle},
      { key: 'location', label: 'Location',      placeholder: 'Remote — Worldwide',      icon: MapPin       },
      { key: 'address',  label: 'Full Address',  placeholder: '123 Street, City, Country', icon: Globe2     },
    ],
  },
  {
    title: 'Social Links',
    fields: SOCIAL_PLATFORMS.map(({ key, label, placeholder, icon }) => ({
      key, label: `${label} URL`, placeholder, icon: icon as unknown as IconComponent,
    })),
  },
];

export default function SiteSettingsPage() {
  const [form, setForm]       = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getSiteSettings().then(s => { setForm(s); setLoading(false); });
  }, []);

  const set = (key: keyof SiteSettings) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => prev ? { ...prev, [key]: e.target.value } : prev);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      await saveSiteSettings(form);
      // Settings feed the Footer on every page (via the root layout) plus the Contact page's info panel.
      await triggerRevalidate([{ path: '/', type: 'layout' }, { path: '/contact' }]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.72rem 1rem 0.72rem 2.75rem',
    background: 'var(--surface-2)', border: '1.5px solid var(--border)',
    borderRadius: '0.65rem', color: 'var(--foreground)',
    fontSize: '0.93rem', outline: 'none', fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.78rem', fontWeight: 700,
    color: 'var(--foreground)', marginBottom: '0.4rem',
    textTransform: 'uppercase', letterSpacing: '0.06em',
  };

  return (
    <div style={{ maxWidth: '720px', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', fontWeight: 800, color: 'var(--foreground)', margin: '0 0 0.35rem' }}>Site Settings</h1>
        <p style={{ color: 'var(--muted)', margin: 0, fontSize: '0.9rem' }}>
          All changes are saved to Firestore and reflected on the Contact page and Footer instantly.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--muted)', padding: '3rem' }}>
          <Loader2 size={22} style={{ animation: 'spin 0.7s linear infinite' }} />
          <span>Loading settings…</span>
        </div>
      ) : (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {SECTIONS.map(section => (
            <div key={section.title} className="card" style={{ padding: '1.75rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--foreground)', margin: '0 0 1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                {section.title}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {section.fields.map(({ key, label, placeholder, icon: Icon }) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                        <Icon size={15} color="var(--muted)" />
                      </div>
                      <input
                        value={form?.[key] ?? ''}
                        onChange={set(key)}
                        placeholder={placeholder}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {error && (
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '0.65rem', color: '#ef4444', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={15} /> {error}
            </div>
          )}
          {success && (
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.3)', borderRadius: '0.65rem', color: '#10b981', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={15} /> Settings saved successfully!
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
            style={{ justifyContent: 'center', opacity: saving ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {saving
              ? <><Loader2 size={15} style={{ animation: 'spin 0.7s linear infinite' }} /> Saving…</>
              : <><Save size={15} /> Save Settings</>
            }
          </button>
        </form>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
