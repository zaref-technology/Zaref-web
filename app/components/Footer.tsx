'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        padding: '3rem 0 2rem',
        marginTop: 'auto',
      }}
    >
      <style>{`
        .footer-link { color: var(--muted); text-decoration: none; font-size: 0.9rem; transition: color 0.2s; }
        .footer-link:hover { color: var(--primary-light); }
      `}</style>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Brand */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            <Image src="/logo.png" alt="Logo" width={32} height={32} style={{ borderRadius: '6px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>Zaref</span>
          </Link>

          {/* Nav Links */}
          <nav style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {[['/', 'Home'], ['/about', 'About'], ['/portfolio', 'Portfolio'], ['/contact', 'Contact']].map(([href, label]) => (
              <Link key={href} href={href} className="footer-link">
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
            © {year} Zaref. All rights reserved. Built with{' '}
            <span style={{ color: 'var(--primary-light)' }}>♥</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
