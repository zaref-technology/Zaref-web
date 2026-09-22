'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/app/context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminSidebar from './components/AdminSidebar';
import { Menu, X, Zap } from 'lucide-react';

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile nav)
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  if (isLoginPage) return <>{children}</>;

  return (
    <ProtectedRoute>
      {/* ─── Responsive Admin CSS ─────────────────────────────── */}
      <style>{`
        .admin-sidebar {
          position: fixed;
          top: 0; left: 0; bottom: 0;
          width: 260px;
          z-index: 200;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .admin-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(2px);
          z-index: 199;
          animation: fadeIn 0.2s ease;
        }
        .admin-main {
          margin-left: 260px;
          min-height: 100vh;
          padding: 2.5rem;
          overflow-x: hidden;
        }
        .admin-mobile-header {
          display: none;
        }
        @media (max-width: 768px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-sidebar.sidebar-open {
            transform: translateX(0);
            box-shadow: 20px 0 60px rgba(0,0,0,0.3);
          }
          .admin-overlay {
            display: block;
          }
          .admin-main {
            margin-left: 0;
            padding: 1rem;
            padding-top: 5rem;
          }
          .admin-mobile-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: fixed;
            top: 0; left: 0; right: 0;
            height: 56px;
            padding: 0 1rem;
            background: var(--surface);
            border-bottom: 1px solid var(--border);
            z-index: 150;
            backdrop-filter: blur(12px);
          }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* Responsive grids inside admin pages */
        @media (max-width: 640px) {
          .admin-stats-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .admin-projects-grid {
            grid-template-columns: 1fr !important;
          }
          .admin-form-row {
            grid-template-columns: 1fr !important;
          }
          .admin-quick-actions {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 400px) {
          .admin-stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Mobile Top Header */}
      <header className="admin-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '30px', height: '30px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={15} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--foreground)' }}>Zaref Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          style={{
            padding: '0.5rem',
            background: 'transparent',
            border: '1.5px solid var(--border)',
            borderRadius: '0.55rem',
            color: 'var(--foreground)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* Overlay (mobile only) */}
      {sidebarOpen && (
        <div
          className="admin-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
        {/* Sidebar */}
        <div className={`admin-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <AdminSidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main Content */}
        <main className="admin-main" style={{ flex: 1 }}>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
