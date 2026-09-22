'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/app/context/AuthContext';
import { useTheme } from '@/app/context/ThemeContext';
import {
  LayoutDashboard,
  FolderOpen,
  MessageSquare,
  LogOut,
  Zap,
  Sun,
  Moon,
  Layers,
  Quote,
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard',    label: 'Dashboard',    Icon: LayoutDashboard },
  { href: '/admin/projects',     label: 'Projects',     Icon: FolderOpen      },
  { href: '/admin/services',     label: 'Services',     Icon: Layers          },
  { href: '/admin/testimonials', label: 'Testimonials', Icon: Quote           },
  { href: '/admin/messages',     label: 'Messages',     Icon: MessageSquare   },
];

interface AdminSidebarProps {
  onClose?: () => void;
}

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router   = useRouter();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/admin/login');
  };

  // Nav link click — close sidebar on mobile
  const handleNavClick = () => { onClose?.(); };

  return (
    <aside style={{
      width: '260px',
      height: '100%',
      minHeight: '100vh',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'var(--primary)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Zap size={17} color="#fff" fill="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--foreground)' }}>Zaref Admin</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Control Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '1rem 0.75rem', flex: 1 }}>
        {navItems.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              onClick={handleNavClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                marginBottom: '0.25rem',
                background: active ? 'var(--primary)' : 'transparent',
                color: active ? '#fff' : 'var(--muted)',
                textDecoration: 'none',
                fontWeight: active ? 700 : 500,
                fontSize: '0.925rem',
                transition: 'all 0.2s',
              }}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + Theme + Logout */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        {/* User info */}
        <div style={{
          padding: '0.65rem 0.85rem',
          background: 'var(--surface-2)',
          borderRadius: '0.75rem',
          marginBottom: '0.6rem',
        }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.15rem' }}>Logged in as</div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--foreground)', wordBreak: 'break-all', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.email ?? '—'}
          </div>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          style={{
            width: '100%',
            padding: '0.6rem 1rem',
            background: 'transparent',
            border: '1.5px solid var(--border)',
            borderRadius: '0.75rem',
            color: 'var(--muted)',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            justifyContent: 'center',
            transition: 'all 0.2s',
            fontFamily: 'inherit',
            marginBottom: '0.5rem',
          }}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '0.6rem 1rem',
            background: 'transparent',
            border: '1.5px solid var(--border)',
            borderRadius: '0.75rem',
            color: 'var(--muted)',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            justifyContent: 'center',
            transition: 'all 0.2s',
            fontFamily: 'inherit',
          }}
        >
          <LogOut size={14} /> Logout
        </button>
      </div>
    </aside>
  );
}
