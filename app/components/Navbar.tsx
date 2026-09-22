'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import { Sun, Moon, ArrowRight, Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/',             label: 'Home'        },
  { href: '/about',        label: 'About'       },
  { href: '/portfolio',    label: 'Portfolio'   },
  { href: '/services',     label: 'Services'    },
  { href: '/testimonials', label: 'Reviews'     },
  { href: '/contact',      label: 'Contact'     },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [scrolled,  setScrolled]  = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [mounted,   setMounted]   = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <style>{`
        /* ── Navbar Styles ─────────────────────────── */
        .nav-pill {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          border-radius: 999px;
          padding: 0.5rem 1.25rem;
          background: var(--nav-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1.5px solid var(--border);
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          transition: all 0.3s ease;
          overflow: hidden;
        }
        .nav-pill.scrolled {
          border-color: color-mix(in srgb, var(--primary) 50%, transparent);
          box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px var(--primary-glow);
          padding: 0.4rem 1.25rem;
        }
        /* desktop nav */
        .nav-center { display: flex; align-items: center; gap: 0.15rem; flex: 1; justify-content: center; }
        @media (max-width: 768px) { .nav-center { display: none; } }

        /* show CTA only on desktop */
        .nav-cta-desktop { display: none !important; }
        @media (min-width: 769px) { .nav-cta-desktop { display: inline-flex !important; } }

        /* show hamburger only on mobile */
        .nav-hamburger { display: none !important; }
        @media (max-width: 768px) { .nav-hamburger { display: flex !important; } }

        /* nav links */
        .nav-link {
          position: relative;
          padding: 0.35rem 0.9rem;
          border-radius: 999px;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          color: var(--muted);
          transition: all 0.2s;
          white-space: nowrap;
        }
        .nav-link:hover { color: var(--foreground); background: var(--surface-2); }
        .nav-link.active {
          color: #fff;
          background: var(--primary);
          box-shadow: 0 4px 14px var(--primary-glow);
        }
        .nav-link.active::before {
          content: '';
          display: inline-block;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.9);
          margin-right: 5px;
          vertical-align: middle;
          animation: navDot 1.8s ease-in-out infinite;
        }
        @keyframes navDot { 0%,100%{opacity:0.5} 50%{opacity:1} }

        /* icon button */
        .icon-btn {
          width: 36px; height: 36px; border-radius: 50%;
          background: var(--surface-2);
          border: 1.5px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
          outline: none;
          font-family: inherit;
        }
        .icon-btn:hover { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-glow); }

        /* progress bar */
        .nav-progress-track {
          position: absolute; bottom: 0; left: 1rem; right: 1rem;
          height: 2px; border-radius: 999px; overflow: hidden;
          transition: opacity 0.3s;
        }
        .nav-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary), var(--primary-light));
          box-shadow: 0 0 8px var(--primary-glow);
          border-radius: 999px;
          transition: width 0.15s ease;
        }

        /* mobile drawer */
        .mobile-drawer {
          margin-top: 0.6rem;
          border-radius: 1.5rem;
          background: var(--nav-bg);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1.5px solid var(--border);
          padding: 1rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.18);
          animation: drawerIn 0.2s ease;
        }
        @keyframes drawerIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-link {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.8rem 1rem;
          border-radius: 0.85rem;
          font-size: 0.975rem; font-weight: 600;
          text-decoration: none;
          color: var(--muted);
          transition: all 0.18s;
          border: 1.5px solid transparent;
        }
        .mobile-link:hover { background: var(--surface-2); color: var(--foreground); }
        .mobile-link.active {
          background: color-mix(in srgb, var(--primary) 10%, transparent);
          color: var(--primary-light);
          border-color: color-mix(in srgb, var(--primary) 25%, transparent);
        }
        .mobile-drawer-divider {
          margin-top: 0.75rem; padding-top: 0.75rem;
          border-top: 1px solid var(--border);
        }
      `}</style>

      <header style={{ position: 'fixed', top: '0.75rem', left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 2rem)', maxWidth: '1100px', zIndex: 50 }}>

        {/* ── Pill Bar ────────────────────────────────────── */}
        <div className={`nav-pill${scrolled ? ' scrolled' : ''}`}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px var(--primary-glow)', flexShrink: 0,
            }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>Z</span>
            </div>
            <span style={{
              fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, var(--foreground) 30%, var(--primary-light))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Zaref
            </span>
          </Link>

          {/* Desktop center nav */}
          <nav className="nav-center">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} className={`nav-link${pathname === l.href ? ' active' : ''}`}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>

            {/* Theme toggle */}
            <button id="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme" className="icon-btn">
              {mounted && theme === 'dark'
                ? <Sun size={15} color="#f59e0b" />
                : <Moon size={15} color="var(--primary-light)" />
              }
            </button>

            {/* CTA button — desktop only */}
            <Link
              href="/contact"
              className="btn-primary nav-cta-desktop"
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem', borderRadius: '999px', textDecoration: 'none' }}
            >
              Let&apos;s Talk <ArrowRight size={14} />
            </Link>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="icon-btn nav-hamburger"
            >
              {menuOpen
                ? <X size={16} color="var(--foreground)" />
                : <Menu size={16} color="var(--foreground)" />
              }
            </button>
          </div>

          {/* Scroll progress */}
          <div className="nav-progress-track" style={{ opacity: scrolled ? 1 : 0 }}>
            <div className="nav-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* ── Mobile Drawer ───────────────────────────────── */}
        {menuOpen && (
          <div className="mobile-drawer">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {navLinks.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className={`mobile-link${pathname === l.href ? ' active' : ''}`}
                >
                  <span>{l.label}</span>
                  {pathname === l.href && (
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 8px var(--primary-glow)', display: 'inline-block', flexShrink: 0 }} />
                  )}
                </Link>
              ))}
            </div>
            <div className="mobile-drawer-divider">
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', borderRadius: '0.85rem', textDecoration: 'none' }}
              >
                Let&apos;s Talk <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}