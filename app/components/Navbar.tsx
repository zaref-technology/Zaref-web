'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import { Sun, Moon, ArrowRight, Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2.5rem)] max-w-6xl z-50 transition-all duration-300">
      {/* Main Floating Capsule Bar */}
      <div
        className={`relative flex items-center justify-between gap-4 rounded-full transition-all duration-300 px-4 sm:px-6 ${scrolled
          ? 'py-2 sm:py-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.6)] ring-1 ring-slate-900/5 dark:ring-blue-500/20'
          : 'py-2.5 sm:py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/80 shadow-[0_4px_20px_rgb(0,0,0,0.05)] dark:shadow-black/40'
          }`}
      >
        {/* Brand Logo & Name */}
        <Link
          href="/"
          aria-label="Zaref Home"
          className="flex items-center gap-2.5 sm:gap-3 group text-decoration-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full"
        >


          <div className="flex items-center gap-2">
            <span className="font-black text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-slate-950 via-blue-700 to-indigo-700 dark:from-white dark:via-blue-300 dark:to-indigo-300 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              Zaref
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation Pill */}
        <nav className="hidden md:flex items-center">
          <div className="flex items-center gap-1 p-1 rounded-full bg-slate-200/60 dark:bg-slate-800/70 border border-slate-300/60 dark:border-slate-700/60 shadow-inner backdrop-blur-md">
            {navLinks.map(link => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 text-decoration-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${active
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/30'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/70'
                    }`}
                >
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)] inline-block animate-pulse" />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Right Controls: Theme Toggle & Primary CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Lucide Sun / Moon Theme Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="w-9.5 h-9.5 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300/80 dark:border-slate-700 text-amber-600 dark:text-blue-400 hover:border-blue-500/50 dark:hover:border-blue-400/50 hover:bg-amber-500/10 dark:hover:bg-blue-500/10 shadow-sm hover:shadow-md hover:shadow-blue-500/15 active:scale-95 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <div
              className={`flex items-center justify-center transition-transform duration-500 ease-out ${mounted && theme === 'dark' ? 'rotate-0 scale-100' : 'rotate-360 scale-100'
                }`}
            >
              {mounted && theme === 'dark' ? (
                <Sun className="w-4.5 h-4.5 text-amber-500" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-blue-400" />
              )}
            </div>
          </button>

          {/* Desktop Primary CTA */}
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center justify-center gap-2 h-9.5 px-5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-decoration-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 group"
          >
            <span>Let's Talk</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={menuOpen}
            className="md:hidden flex items-center justify-center w-9.5 h-9.5 rounded-full border border-slate-300/80 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer transition-colors"
          >
            {menuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>

        {/* Floating Reading Progress Bar along bottom edge */}
        <div className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 transition-[width] duration-150 ease-out shadow-[0_0_8px_rgba(37,99,235,0.9)]"
            style={{
              width: `${scrollProgress}%`,
              opacity: scrolled ? 1 : 0,
            }}
          />
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-2.5 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200">
          <ul className="flex flex-col gap-1.5 list-none p-0 m-0">
            {navLinks.map(link => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-base transition-all duration-200 text-decoration-none ${active
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-semibold shadow-xs'
                      : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-medium'
                      }`}
                  >
                    <span>{link.label}</span>
                    {active && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-base font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 shadow-md shadow-blue-500/25 active:scale-[0.99] transition-all duration-200 text-decoration-none"
            >
              <span>Let's Talk</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}