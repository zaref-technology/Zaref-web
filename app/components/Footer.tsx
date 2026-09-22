'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSiteSettings, SiteSettings } from '@/lib/siteSettings';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa6';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/services', label: 'Services' },
  { href: '/testimonials', label: 'Reviews' },
  { href: '/contact', label: 'Contact' },
];

type SocialLink = {
  key: keyof SiteSettings;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
};

const SOCIAL_LINKS: SocialLink[] = [
  { key: 'github', icon: FaGithub, label: 'GitHub' },
  { key: 'linkedin', icon: FaLinkedin, label: 'LinkedIn' },
  { key: 'twitter', icon: FaTwitter, label: 'Twitter' },
  { key: 'instagram', icon: FaInstagram, label: 'Instagram' },
  { key: 'facebook', icon: FaFacebook, label: 'Facebook' },
  { key: 'youtube', icon: FaYoutube, label: 'YouTube' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

  const socials = SOCIAL_LINKS.filter(s => settings?.[s.key]);

  return (
    <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
      <style>{`
        .footer-link { color: var(--muted); text-decoration: none; font-size: 0.875rem; transition: color 0.2s; font-weight: 500; }
        .footer-link:hover { color: var(--primary-light); }
        .social-btn {
          width: 36px; height: 36px; border-radius: 50%;
          background: var(--surface-2); border: 1.5px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--muted); text-decoration: none;
          transition: all 0.2s;
        }
        .social-btn:hover { background: var(--primary); border-color: var(--primary); color: #fff; transform: translateY(-2px); }
        .footer-contact-row { display: flex; align-items: center; gap: 0.5rem; color: var(--muted); font-size: 0.875rem; text-decoration: none; transition: color 0.2s; }
        .footer-contact-row:hover { color: var(--primary-light); }
      `}</style>

      <div className="container" style={{ padding: '3.5rem 1.5rem 2rem' }}>
        {/* Top grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>

          {/* Brand column */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px var(--primary-glow)' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#fff' }}>Z</span>
              </div>
              <span style={{ fontWeight: 900, fontSize: '1.15rem', letterSpacing: '-0.03em', background: 'linear-gradient(135deg, var(--foreground) 30%, var(--primary-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {settings?.siteName ?? 'Zaref'}
              </span>
            </Link>
            <p style={{ color: 'var(--muted)', fontSize: '0.865rem', lineHeight: 1.7, margin: '0 0 1.25rem', maxWidth: '220px' }}>
              {settings?.tagline ?? 'Building digital experiences that matter.'}
            </p>
            {/* Social icons */}
            {socials.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {socials.map(({ key, icon: Icon, label }) => (
                  <a
                    key={key}
                    href={settings![key] as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="social-btn"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--foreground)', marginBottom: '1rem' }}>Navigation</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {navLinks.map(l => (
                <Link key={l.href} href={l.href} className="footer-link">{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--foreground)', marginBottom: '1rem' }}>Contact</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="footer-contact-row">
                  <Mail size={14} style={{ flexShrink: 0 }} />
                  <span>{settings.email}</span>
                </a>
              )}
              {settings?.phone && (
                <a href={`tel:${settings.phone}`} className="footer-contact-row">
                  <Phone size={14} style={{ flexShrink: 0 }} />
                  <span>{settings.phone}</span>
                </a>
              )}
              {settings?.location && (
                <span className="footer-contact-row" style={{ cursor: 'default' }}>
                  <MapPin size={14} style={{ flexShrink: 0 }} />
                  <span>{settings.location}</span>
                </span>
              )}
            </div>
          </div>

          {/* CTA */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--foreground)', marginBottom: '1rem' }}>Work With Us</div>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1rem' }}>
              Have a project in mind? Let&apos;s build something great together.
            </p>
            <Link href="/contact" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', borderRadius: '999px', textDecoration: 'none', display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
              Get in Touch <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ color: 'var(--muted)', fontSize: '0.82rem', margin: 0 }}>
            © {year} {settings?.siteName ?? 'Zaref'}. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}
