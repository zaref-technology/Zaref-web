'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext';
import { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { NAV_LINKS } from '@/constants/nav';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { isActiveRoute } from '@/lib/nav';

const iconBtn =
  'flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted transition-colors hover:bg-foreground/[0.05] hover:text-foreground';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

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
            className="relative inline-block h-7 w-auto md:h-9"
            style={{ aspectRatio: '1724 / 369' }}
          >
            <Image src="/zaref-logo-full-light.png" alt="Zaref" fill sizes="200px" className="object-contain object-left dark:hidden" priority />
            <Image src="/zaref-logo-full-dark.png" alt="Zaref" fill sizes="200px" className="hidden object-contain object-left dark:block" priority />
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(l => {
            const activePath = l.activePath === undefined ? l.href : l.activePath;
            const active = activePath !== null && isActiveRoute(pathname, activePath);
            return (
              <Link
                key={l.href}
                href={l.href}
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
          <button onClick={toggleTheme} aria-label="Toggle theme" className={iconBtn}>
            {mounted && theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <div className="hidden md:inline-flex">
            <Button href={ROUTES.contact} size="sm">
              Discuss Your Project
            </Button>
          </div>

          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className={cn(iconBtn, 'flex md:hidden')}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="animate-fade-in border-t border-border bg-[var(--nav-bg)] px-6 py-5 backdrop-blur-md md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(l => {
              const activePath = l.activePath === undefined ? l.href : l.activePath;
              const active = activePath !== null && isActiveRoute(pathname, activePath);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
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
