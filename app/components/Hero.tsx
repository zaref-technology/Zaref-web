'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: '70px',
      }}
    >
      {/* Animated Glow Blobs */}
      <div
        className="glow-blob"
        style={{
          width: '600px',
          height: '600px',
          background: 'var(--primary)',
          top: '-150px',
          right: '-150px',
          animation: 'blobFloat 8s ease-in-out infinite',
        }}
      />
      <div
        className="glow-blob"
        style={{
          width: '400px',
          height: '400px',
          background: 'var(--primary-light)',
          bottom: '0px',
          left: '-100px',
          animation: 'blobFloat 10s ease-in-out infinite reverse',
        }}
      />

      {/* Grid Pattern Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--primary) 15%, transparent) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: '4rem 1.5rem',
        }}
      >

        {/* Headline */}
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
            color: 'var(--foreground)',
          }}
        >
          Building{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Digital
          </span>
          <br />
          Experiences
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: 'var(--muted)',
            maxWidth: '600px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.7,
          }}
        >
          A creative agency crafting modern, performant, and beautiful web applications that leave a lasting impression.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/portfolio" className="btn-primary">
            View Portfolio
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
          <Link href="/contact" className="btn-outline">
            Get In Touch
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div
          style={{
            marginTop: '4rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: 0.5,
          }}
        >
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scroll</span>
          <div
            style={{
              width: '2px',
              height: '40px',
              background: 'linear-gradient(to bottom, var(--primary), transparent)',
              animation: 'scrollPulse 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes blobFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.97); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.5; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.2); }
        }
      `}</style>
    </section>
  );
}
