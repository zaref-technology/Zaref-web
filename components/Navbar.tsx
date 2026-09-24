'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext';
import { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { NAV_LINKS } from '@/constants/nav';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { isNavLinkActive } from '@/lib/nav';

const iconBtn =
  'flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted transition-colors hover:bg-foreground/[0.05] hover:text-foreground';

const subscribeNoop = () => () => {};

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // false on the server and during hydration, true afterwards — same timing as the former
  // mount effect, without a setState-in-effect.
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const [hash, setHash] = useState('');
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Escape closes the mobile menu and returns focus to the button that opened it.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  // Tracks the URL hash so links like "Solutions" (/services#solutions) can highlight correctly
  // even though it shares its base path with "Services" and usePathname() doesn't expose hashes.
  useEffect(() => {
    setHash(window.location.hash);
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-200',
        scrolled
          ? 'border-b border-border bg-[var(--nav-bg)] backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <div className="mx-auto flex h-[var(--header-height)] max-w-[1200px] items-center justify-between px-6">
        {/* Logo — official ZAREF lockup asset, used as-is (no reconstruction), theme-swapped */}
        <Link href="/" className="flex flex-shrink-0 items-center">
          <span
            className="relative inline-block h-7 w-[131px] md:h-9 md:w-[168px]"
            style={{ aspectRatio: '1724 / 369' }}
          >
            <Image src="/zaref-logo-full-light.png" alt="Zaref" fill unoptimized sizes="200px" className="object-contain object-left dark:hidden" priority />
            <Image src="/zaref-logo-full-dark.png" alt="Zaref" fill unoptimized sizes="200px" className="hidden object-contain object-left dark:block" priority />
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(l => {
            const active = isNavLinkActive(l, NAV_LINKS, pathname, hash);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setHash(l.href.includes('#') ? `#${l.href.split('#')[1]}` : '')}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'text-sm font-medium text-muted transition-colors hover:text-foreground',
                  active && 'text-primary hover:text-primary'
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Right controls */}
        <div className="flex flex-shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            // The theme is only known after mount (it's set pre-hydration from localStorage / OS
            // preference), so the pre-mount label stays neutral to match the server HTML.
            aria-label={mounted ? (theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme') : 'Toggle theme'}
            className={iconBtn}
          >
            {mounted && theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
          </button>

          <div className="hidden md:inline-flex">
            <Button href={ROUTES.contact} size="sm">
              Discuss Your Project
            </Button>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className={cn(iconBtn, 'flex md:hidden')}
          >
            {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div id="mobile-menu" className="animate-fade-in border-t border-border bg-[var(--nav-bg)] px-6 py-5 backdrop-blur-md md:hidden">
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {NAV_LINKS.map(l => {
              const active = isNavLinkActive(l, NAV_LINKS, pathname, hash);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => {
                    setHash(l.href.includes('#') ? `#${l.href.split('#')[1]}` : '');
                    setMenuOpen(false);
                  }}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'rounded-md px-3 py-3 text-[0.95rem] font-medium text-muted transition-colors hover:bg-foreground/[0.04] hover:text-foreground',
                    active && 'bg-primary/[0.06] text-primary'
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 border-t border-border pt-4">
            <Button href={ROUTES.contact} onClick={() => setMenuOpen(false)} fullWidth className="justify-center">
              Discuss Your Project
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
