'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getSiteSettings, SiteSettings } from '@/lib/siteSettings';
import {
  Mail, Phone, MessageCircle, MapPin, Send, CheckCircle, AlertTriangle,
} from 'lucide-react';
import {
  FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaYoutube,
} from 'react-icons/fa6';

type InfoItem = {
  key: keyof SiteSettings;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  hrefPrefix?: string;
  external?: boolean;
};

const INFO_ITEMS: InfoItem[] = [
  { key: 'email',    label: 'Email',     icon: Mail,           hrefPrefix: 'mailto:' },
  { key: 'phone',    label: 'Phone',     icon: Phone,          hrefPrefix: 'tel:'    },
  { key: 'whatsapp', label: 'WhatsApp',  icon: MessageCircle,  hrefPrefix: 'https://wa.me/', external: true },
  { key: 'location', label: 'Location',  icon: MapPin          },
];

const SOCIAL_ITEMS: InfoItem[] = [
  { key: 'github',    label: 'GitHub',    icon: FaGithub,    external: true },
  { key: 'linkedin',  label: 'LinkedIn',  icon: FaLinkedin,  external: true },
  { key: 'twitter',   label: 'Twitter',   icon: FaTwitter,   external: true },
  { key: 'instagram', label: 'Instagram', icon: FaInstagram, external: true },
  { key: 'facebook',  label: 'Facebook',  icon: FaFacebook,  external: true },
  { key: 'youtube',   label: 'YouTube',   icon: FaYoutube,   external: true },
];

export default function Contact() {
  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' });
  const [state, setState]     = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => { getSiteSettings().then(setSettings); }, []);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMsg('Please fill in Name, Email, and Message.');
      setState('error');
      return;
    }
    setState('loading');
    setErrorMsg('');
    try {
      await addDoc(collection(db, 'messages'), { ...form, read: false, createdAt: serverTimestamp() });
      setState('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setErrorMsg('Something went wrong. Please try again.');
      setState('error');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.75rem 1rem',
    background: 'var(--surface-2)', border: '1.5px solid var(--border)',
    borderRadius: '0.65rem', color: 'var(--foreground)',
    fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  };

  const activeInfo = INFO_ITEMS.filter(i => settings?.[i.key]);
  const activeSocials = SOCIAL_ITEMS.filter(i => settings?.[i.key]);

  return (
    <div style={{ paddingTop: '70px' }}>
      <style>{`
        .contact-link { color: var(--foreground); font-weight: 600; text-decoration: none; font-size: 0.925rem; transition: color 0.2s; }
        .contact-link:hover { color: var(--primary-light); }
        @media (max-width: 520px) { .form-row { grid-template-columns: 1fr !important; } }
        input:focus, textarea:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 3px var(--primary-glow); }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeIn  { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .social-chip {
          display: inline-flex; align-items: center; gap: 0.45rem;
          padding: 0.4rem 0.9rem;
          background: var(--surface-2); border: 1.5px solid var(--border);
          border-radius: 999px; text-decoration: none;
          color: var(--muted); font-size: 0.82rem; font-weight: 600;
          transition: all 0.2s;
        }
        .social-chip:hover { background: var(--primary); border-color: var(--primary); color: #fff; transform: translateY(-2px); }
      `}</style>

      {/* Header */}
      <section style={{ position: 'relative', padding: '6rem 0 5rem', overflow: 'hidden', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="glow-blob" style={{ width: '500px', height: '500px', background: 'var(--primary)', bottom: '-200px', right: '-150px' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="badge" style={{ margin: '0 auto 1rem' }}>Contact</div>
          <h1 className="section-title" style={{ margin: '0 auto 1rem' }}>Let&apos;s Work Together</h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Have a project in mind? We&apos;d love to hear about it. Let&apos;s create something great.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>

            {/* Info panel */}
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: '0.75rem' }}>Get in Touch</h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: '2rem' }}>
                Whether you have a project idea, a question, or just want to say hello — our inbox is always open.
              </p>

              {/* Contact info cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
                {activeInfo.length > 0 ? activeInfo.map(info => {
                  const Icon = info.icon;
                  const value = settings![info.key] as string;
                  const href = info.hrefPrefix
                    ? `${info.hrefPrefix}${value.replace(/\s/g, '')}`
                    : null;
                  return (
                    <div key={info.key} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '0.65rem', background: 'color-mix(in srgb, var(--primary) 12%, transparent)', border: '1.5px solid color-mix(in srgb, var(--primary) 25%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={17} color="var(--primary-light)" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.15rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{info.label}</div>
                        {href ? (
                          <a href={href} target={info.external ? '_blank' : undefined} rel="noopener noreferrer" className="contact-link">{value}</a>
                        ) : (
                          <span style={{ color: 'var(--foreground)', fontWeight: 600, fontSize: '0.925rem' }}>{value}</span>
                        )}
                      </div>
                    </div>
                  );
                }) : (
                  <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Contact details coming soon.</p>
                )}
              </div>

              {/* Social links */}
              {activeSocials.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: '0.75rem' }}>Find us on</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {activeSocials.map(s => {
                      const Icon = s.icon;
                      return (
                        <a key={s.key} href={settings![s.key] as string} target="_blank" rel="noopener noreferrer" className="social-chip">
                          <Icon size={13} /> {s.label}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div className="card" style={{ padding: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: '1.75rem' }}>Send a Message</h2>

              {state === 'success' ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', animation: 'fadeIn 0.4s ease' }}>
                  <CheckCircle size={52} color="var(--primary-light)" style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.9 }} />
                  <h3 style={{ fontWeight: 800, color: 'var(--foreground)', marginBottom: '0.5rem' }}>Message Sent!</h3>
                  <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Thanks for reaching out. We&apos;ll get back to you as soon as possible.</p>
                  <button onClick={() => setState('idle')} className="btn-outline" style={{ display: 'inline-flex' }}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
                    <div>
                      <label htmlFor="contact-name" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.4rem' }}>Name *</label>
                      <input id="contact-name" type="text" value={form.name} onChange={set('name')} placeholder="John Doe" style={inputStyle} />
                    </div>
                    <div>
                      <label htmlFor="contact-email" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.4rem' }}>Email *</label>
                      <input id="contact-email" type="email" value={form.email} onChange={set('email')} placeholder="john@example.com" style={inputStyle} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.4rem' }}>Subject</label>
                    <input id="contact-subject" type="text" value={form.subject} onChange={set('subject')} placeholder="Project Inquiry" style={inputStyle} />
                  </div>

                  <div>
                    <label htmlFor="contact-message" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.4rem' }}>Message *</label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      value={form.message}
                      onChange={set('message')}
                      placeholder="Tell us about your project..."
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                  </div>

                  {state === 'error' && (
                    <div style={{ padding: '0.75rem 1rem', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '0.65rem', color: '#ef4444', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <AlertTriangle size={14} /> {errorMsg}
                    </div>
                  )}

                  <button
                    id="contact-submit-btn"
                    type="submit"
                    disabled={state === 'loading'}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', opacity: state === 'loading' ? 0.7 : 1 }}
                  >
                    {state === 'loading' ? (
                      <>
                        <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block', flexShrink: 0 }} />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Message <Send size={15} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
