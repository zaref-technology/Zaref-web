'use client';

import Link from 'next/link';
import { ArrowRight, Code2, Layers, Smartphone } from 'lucide-react';

const floatingChips = [
  { icon: Code2, label: 'Full-Stack Dev', color: '#2563eb', delay: '0s', top: '22%', left: '6%' },
  { icon: Layers, label: 'UI / UX Design', color: '#7c3aed', delay: '0.4s', top: '60%', left: '4%' },
  { icon: Smartphone, label: 'Mobile Apps', color: '#059669', delay: '0.8s', top: '20%', right: '5%' },
];

export default function Hero() {
  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', paddingTop: '70px' }}>
      <style>{`
        /* Glow blobs */
        .hero-blob-1 {
          position: absolute; border-radius: 50%; pointer-events: none; z-index: 0;
          width: 650px; height: 650px;
          background: var(--primary);
          top: -180px; right: -160px;
          filter: blur(90px); opacity: 0.22;
          animation: blobFloat 9s ease-in-out infinite;
        }
        .hero-blob-2 {
          position: absolute; border-radius: 50%; pointer-events: none; z-index: 0;
          width: 420px; height: 420px;
          background: var(--primary-light);
          bottom: -60px; left: -80px;
          filter: blur(80px); opacity: 0.18;
          animation: blobFloat 11s ease-in-out infinite reverse;
        }
        @keyframes blobFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(28px,-28px) scale(1.04); }
          66%      { transform: translate(-18px,18px) scale(0.97); }
        }

        /* Grid overlay */
        .hero-grid {
          position: absolute; inset: 0; z-index: 0;
          background-image: radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--primary) 14%, transparent) 1px, transparent 0);
          background-size: 44px 44px;
        }

        /* Floating chips (desktop only) */
        .hero-chip {
          position: absolute; z-index: 2;
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.55rem 1rem;
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 999px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.10);
          font-size: 0.82rem; font-weight: 700;
          color: var(--foreground);
          white-space: nowrap;
          animation: chipFloat 5s ease-in-out infinite;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        @media (max-width: 768px) { .hero-chip { display: none; } }
        @keyframes chipFloat {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }

        /* Headline gradient */
        .hero-gradient-text {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 50%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Tech tag pills */
        .tech-tag {
          display: inline-flex; align-items: center; gap: 0.35rem;
          padding: 0.3rem 0.85rem;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 999px;
          font-size: 0.78rem; font-weight: 600;
          color: var(--muted);
          transition: all 0.2s;
        }
        .tech-tag:hover { border-color: var(--primary); color: var(--primary-light); background: color-mix(in srgb, var(--primary) 8%, transparent); }

        /* Scroll indicator */
        .scroll-indicator {
          position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
          opacity: 0.45; z-index: 2;
        }
        .scroll-bar {
          width: 2px; height: 44px;
          background: linear-gradient(to bottom, var(--primary), transparent);
          border-radius: 999px;
          animation: scrollPulse 2s ease-in-out infinite;
        }
        @keyframes scrollPulse {
          0%,100% { opacity: 0.45; transform: scaleY(1); }
          50%      { opacity: 1; transform: scaleY(1.15); }
        }

        /* Stat counter cards */
        .hero-stat {
          padding: 1rem 1.5rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 1rem;
          text-align: center;
          transition: all 0.2s;
          flex: 1; min-width: 110px;
        }
        .hero-stat:hover { border-color: var(--primary); transform: translateY(-3px); box-shadow: 0 8px 24px var(--primary-glow); }
        .hero-stat-value { font-size: 1.6rem; font-weight: 900; color: var(--primary); line-height: 1; }
        .hero-stat-label { font-size: 0.73rem; color: var(--muted); margin-top: 0.2rem; font-weight: 600; }
      `}</style>

      {/* Background layers */}
      <div className="hero-blob-1" />
      <div className="hero-blob-2" />
      <div className="hero-grid" />

      {/* Floating chips */}
      {floatingChips.map((chip, i) => {
        const Icon = chip.icon;
        return (
          <div
            key={i}
            className="hero-chip"
            style={{
              top: chip.top, left: chip.left, right: chip.right,
              animationDelay: chip.delay,
              borderColor: `${chip.color}35`,
            }}
          >
            <Icon size={14} color={chip.color} />
            <span>{chip.label}</span>
          </div>
        );
      })}

      {/* Main Content */}
      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '4rem 1.5rem' }}>



        {/* Headline */}
        <h1 style={{ fontSize: 'clamp(2.8rem, 8vw, 6rem)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.035em', margin: '0 0 1.5rem', color: 'var(--foreground)' }}>
          Building{' '}
          <span className="hero-gradient-text">Digital</span>
          <br />
          Experiences
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: 'var(--muted)', maxWidth: '560px', margin: '0 auto 2rem', lineHeight: 1.75 }}>
          A creative agency crafting modern, performant, and beautiful web applications that leave a lasting impression.
        </p>



        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}>
          <Link href="/portfolio" className="btn-primary" style={{ borderRadius: '999px', padding: '0.85rem 2.25rem', fontSize: '1rem' }}>
            View Our Work
            <ArrowRight size={17} />
          </Link>
          <Link href="/contact" className="btn-outline" style={{ borderRadius: '999px', padding: '0.85rem 2.25rem', fontSize: '1rem' }}>
            Start a Project
          </Link>
        </div>


      </div>

      {/* Scroll cue */}
      <div className="scroll-indicator">
        <span style={{ fontSize: '0.72rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Scroll</span>
        <div className="scroll-bar" />
      </div>
    </section>
  );
}
