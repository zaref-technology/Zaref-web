'use client';

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const contactInfo = [
  { icon: '📧', label: 'Email',    value: 'hello@zaref.dev',      href: 'mailto:hello@zaref.dev' },
  { icon: '💼', label: 'LinkedIn', value: 'linkedin.com/in/zaref', href: '#'                     },
  { icon: '🐙', label: 'GitHub',   value: 'github.com/zaref',     href: '#'                     },
  { icon: '🌍', label: 'Location', value: 'Remote — Worldwide',   href: null                    },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

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
      await addDoc(collection(db, 'messages'), {
        ...form,
        read: false,
        createdAt: serverTimestamp(),
      });
      setState('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setErrorMsg('Something went wrong. Please try again.');
      setState('error');
    }
  };

  const hoverStyles = `
    .contact-link { color: var(--foreground); font-weight: 600; text-decoration: none; font-size: 0.925rem; transition: color 0.2s; }
    .contact-link:hover { color: var(--primary-light); }
    @media (max-width: 520px) { .form-row { grid-template-columns: 1fr !important; } }
    input:focus, textarea:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 3px var(--primary-glow); }
  `;

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'var(--surface-2)',
    border: '1.5px solid var(--border)',
    borderRadius: '0.65rem',
    color: 'var(--foreground)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  };

  return (
    <div style={{ paddingTop: '70px' }}>
      <style>{hoverStyles}</style>
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

            {/* Info Cards */}
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: '0.75rem' }}>Get in Touch</h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: '2rem' }}>
                Whether you have a project idea, a question, or just want to say hello — our inbox is always open.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {contactInfo.map(info => (
                  <div key={info.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{info.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{info.label}</div>
                      {info.href ? (
                        <a href={info.href} className="contact-link">{info.value}</a>
                      ) : (
                        <span style={{ color: 'var(--foreground)', fontWeight: 600, fontSize: '0.925rem' }}>{info.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="card" style={{ padding: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: '1.75rem' }}>Send a Message</h2>

              {state === 'success' ? (
                <div style={{
                  textAlign: 'center', padding: '3rem 1rem',
                  animation: 'fadeIn 0.4s ease',
                }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
                  <h3 style={{ fontWeight: 800, color: 'var(--foreground)', marginBottom: '0.5rem' }}>Message Sent!</h3>
                  <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Thanks for reaching out. We&apos;ll get back to you as soon as possible.</p>
                  <button
                    onClick={() => setState('idle')}
                    className="btn-outline"
                    style={{ display: 'inline-flex' }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Name & Email row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
                    <div>
                      <label htmlFor="name" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.4rem' }}>Name *</label>
                      <input id="name" type="text" value={form.name} onChange={set('name')} placeholder="John Doe" style={inputStyle} />
                    </div>
                    <div>
                      <label htmlFor="email" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.4rem' }}>Email *</label>
                      <input id="email" type="email" value={form.email} onChange={set('email')} placeholder="john@example.com" style={inputStyle} />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.4rem' }}>Subject</label>
                    <input id="subject" type="text" value={form.subject} onChange={set('subject')} placeholder="Project Inquiry" style={inputStyle} />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.4rem' }}>Message *</label>
                    <textarea
                      id="message"
                      rows={5}
                      value={form.message}
                      onChange={set('message')}
                      placeholder="Tell us about your project..."
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                  </div>

                  {state === 'error' && (
                    <div style={{ padding: '0.75rem 1rem', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '0.65rem', color: '#ef4444', fontSize: '0.875rem' }}>
                      ⚠️ {errorMsg}
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
                        <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"/></svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
