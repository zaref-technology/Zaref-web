'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/app/context/AuthContext';
import { Zap, Mail, Lock, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';

function LoginForm() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [busy, setBusy]         = useState(false);
  const [mounted, setMounted]   = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!loading && user) router.replace('/admin/dashboard');
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setBusy(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/admin/dashboard');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.9rem 1rem 0.9rem 2.75rem',
    background: 'rgba(255,255,255,0.06)',
    border: '1.5px solid rgba(255,255,255,0.12)',
    borderRadius: '0.75rem',
    color: '#f1f5f9',
    fontSize: '0.975rem',
    outline: 'none',
    fontFamily: 'inherit',
    backdropFilter: 'blur(4px)',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #111827 50%, #0d1117 100%)',
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem',
    }}>
      {/* Animated background blobs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(37,99,235,0.15)', filter: 'blur(80px)', top: '-150px', left: '-150px', animation: mounted ? 'float1 8s ease-in-out infinite' : 'none' }} />
        <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(124,58,237,0.12)', filter: 'blur(80px)', bottom: '-100px', right: '-100px', animation: mounted ? 'float2 10s ease-in-out infinite' : 'none' }} />
        <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(5,150,105,0.1)', filter: 'blur(60px)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animation: mounted ? 'float3 12s ease-in-out infinite' : 'none' }} />
      </div>
      <style>{`
        @keyframes float1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,30px)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,40px)} }
        @keyframes float3 { 0%,100%{transform:translate(-50%,-50%)} 50%{transform:translate(-45%,-55%)} }
        .login-input:focus { border-color: rgba(59,130,246,0.7) !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Card */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(17,24,39,0.75)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '1.5rem',
        padding: '2.5rem',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px', height: '56px',
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 24px rgba(37,99,235,0.4)',
          }}>
            <Zap size={24} color="#fff" fill="#fff" />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f1f5f9', margin: '0 0 0.3rem' }}>Admin Login</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} color="#64748b" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                id="admin-email"
                type="email"
                className="login-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com"
                style={inputStyle}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} color="#64748b" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                id="admin-password"
                type="password"
                className="login-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              background: 'rgba(220,38,38,0.15)',
              border: '1px solid rgba(220,38,38,0.4)',
              borderRadius: '0.65rem',
              color: '#f87171',
              fontSize: '0.875rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <AlertTriangle size={14} />
              {error}
            </div>
          )}

          <button
            id="admin-login-btn"
            type="submit"
            disabled={busy}
            style={{
              width: '100%',
              padding: '0.9rem',
              background: busy ? 'rgba(37,99,235,0.6)' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#fff',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: busy ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
              transition: 'all 0.2s',
              boxShadow: busy ? 'none' : '0 4px 16px rgba(37,99,235,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontFamily: 'inherit',
            }}
          >
            {busy ? (
              <><Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> Signing in…</>
            ) : (
              <>Sign In <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <a href="/" style={{ color: '#64748b', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s' }}>
            ← Back to portfolio
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}
