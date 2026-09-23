'use client';

import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {},
});

// useLayoutEffect on the client only. Using the real useLayoutEffect during SSR triggers
// React's "useLayoutEffect does nothing on the server" warning; this is the standard
// dependency-free workaround (no new package needed for two lines).
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function resolveTheme(): Theme {
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // 'light' is a deterministic, SSR-safe default — server and first client render always
  // agree, so there's no hydration mismatch from this state itself. The inline script in
  // RootLayout already applied the *real* data-theme attribute before paint; this just brings
  // React's own state in sync with it, using the same stored -> OS preference -> light logic.
  const [theme, setTheme] = useState<Theme>('light');

  // Runs before paint (not after, like useEffect) so it also re-applies data-theme on a
  // React Strict Mode dev remount, which clears attributes the inline script set outside
  // React's control — a production no-op, but keeps dev behavior correct too. See
  // "Re-applying attributes in development" in the Next.js flash-prevention guide.
  useIsomorphicLayoutEffect(() => {
    const resolved = resolveTheme();
    setTheme(resolved);
    // Re-applies the attribute the inline script already set for the real first paint.
    // Redundant in production (same value), but necessary in dev: React Strict Mode's
    // deliberate remount resets <html> to only the attributes it manages from JSX, clearing
    // whatever the inline script set outside React's knowledge.
    document.documentElement.setAttribute('data-theme', resolved);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
