'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  ArrowLeft, Globe, GitFork, ExternalLink, ChevronLeft,
  ChevronRight, Loader2, Search, Play,
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  tags: string;
  description: string;
  color: string;
  projectUrl: string;
  githubUrl: string;
  youtubeUrl?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  images: string[];
}

interface PageProps { params: Promise<{ id: string }>; }

/* ── YouTube URL → embed URL ─────────────────────────────────── */
function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    // youtu.be/VIDEO_ID
    if (parsed.hostname === 'youtu.be') {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    // youtube.com/watch?v=VIDEO_ID
    if (parsed.hostname.includes('youtube.com')) {
      const v = parsed.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;
      // already /embed/
      if (parsed.pathname.startsWith('/embed/')) return url;
    }
  } catch { /* invalid URL */ }
  return null;
}

/* ── Unified Media Carousel (video + images, swipeable) ─────── */
type Slide =
  | { type: 'video'; embedUrl: string }
  | { type: 'image'; url: string; alt: string };

function MediaCarousel({ images, embedUrl, color, title }: {
  images: string[];
  embedUrl: string | null;
  color: string;
  title: string;
}) {
  const slides: Slide[] = [
    ...(embedUrl ? [{ type: 'video' as const, embedUrl }] : []),
    ...images.map((url, i) => ({ type: 'image' as const, url, alt: `${title} screenshot ${i + 1}` })),
  ];

  const [idx, setIdx] = useState(0);
  const touchStart = useState<number | null>(null);

  const prev = () => setIdx(i => (i - 1 + slides.length) % slides.length);
  const next = () => setIdx(i => (i + 1) % slides.length);

  const onTouchStart = (e: React.TouchEvent) => { touchStart[1](e.touches[0].clientX); };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart[0] === null) return;
    const delta = touchStart[0] - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
    touchStart[1](null);
  };

  // No media at all — show letter placeholder
  if (slides.length === 0) {
    return (
      <div style={{
        width: '100%', aspectRatio: '16/9',
        background: `linear-gradient(135deg, ${color}18, ${color}40)`,
        border: `1.5px solid ${color}33`, borderRadius: '1rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '5rem', fontWeight: 900, color,
      }}>
        {title.charAt(0)}
      </div>
    );
  }

  const current = slides[idx];

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Main viewport */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          position: 'relative', width: '100%', aspectRatio: '16/9',
          borderRadius: '1rem', overflow: 'hidden',
          background: current.type === 'video' ? '#000' : 'var(--surface-2)',
          userSelect: 'none',
        }}
      >
        {current.type === 'video' ? (
          <iframe
            src={current.embedUrl}
            title={`${title} demo video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.url}
              alt={current.alt}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.28) 0%, transparent 50%)', pointerEvents: 'none' }} />
          </>
        )}

        {/* Counter badge */}
        <div style={{
          position: 'absolute', top: '10px', right: '10px',
          background: 'rgba(0,0,0,0.6)', color: '#fff',
          fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '99px',
          backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', gap: '5px',
        }}>
          {current.type === 'video' && <Play size={11} fill="#fff" color="#fff" />}
          {idx + 1} / {slides.length}
        </div>

        {/* Arrows */}
        {slides.length > 1 && (
          <>
            <button onClick={prev} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(0,0,0,0.55)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(6px)', transition: 'background 0.2s' }}>
              <ChevronLeft size={18} />
            </button>
            <button onClick={next} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(0,0,0,0.55)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(6px)', transition: 'background 0.2s' }}>
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {slides.length > 1 && (
          <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '5px' }}>
            {slides.map((s, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                style={{
                  width: i === idx ? '20px' : '7px', height: '7px',
                  borderRadius: '999px',
                  background: i === idx ? '#fff' : 'rgba(255,255,255,0.45)',
                  border: 'none', padding: 0, cursor: 'pointer',
                  transition: 'all 0.25s',
                  boxShadow: i === idx ? '0 0 6px rgba(255,255,255,0.7)' : 'none',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail strip — only for image slides */}
      {slides.filter(s => s.type === 'image').length > 1 && (
        <div style={{ display: 'flex', gap: '0.55rem', marginTop: '0.75rem', overflowX: 'auto', paddingBottom: '4px' }}>
          {slides.map((s, i) => {
            const isActive = i === idx;
            return (
              <button
                key={i}
                onClick={() => setIdx(i)}
                style={{
                  flex: '0 0 68px', height: '50px', padding: 0, border: 'none', cursor: 'pointer',
                  borderRadius: '0.5rem', overflow: 'hidden',
                  outline: isActive ? `2.5px solid ${color}` : '2.5px solid transparent',
                  opacity: isActive ? 1 : 0.5,
                  transition: 'all 0.2s',
                  background: s.type === 'video' ? '#000' : 'var(--surface-2)',
                }}
              >
                {s.type === 'video' ? (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
                    <Play size={18} fill="#fff" color="#fff" />
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.url} alt={s.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Main Project Detail Page ────────────────────────────────── */
export default function ProjectDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      try {
        const snap = await getDoc(doc(db, 'projects', id));
        if (!snap.exists()) { setNotFound(true); return; }
        setProject({ id: snap.id, ...snap.data() } as Project);
      } catch { setNotFound(true); }
      finally { setLoading(false); }
    }
    fetchProject();
  }, [id]);

  if (loading) return (
    <div style={{ paddingTop: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '0.75rem', color: 'var(--muted)' }}>
      <Loader2 size={26} style={{ animation: 'spin 0.7s linear infinite' }} />
      <span>Loading project…</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (notFound || !project) return (
    <div style={{ paddingTop: '70px', textAlign: 'center', padding: '8rem 1rem' }}>
      <Search size={52} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.25, color: 'var(--muted)' }} />
      <h1 style={{ fontWeight: 800, color: 'var(--foreground)', marginBottom: '0.5rem' }}>Project Not Found</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '1.75rem' }}>This project may have been removed or the link is incorrect.</p>
      <Link href="/portfolio" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
        <ArrowLeft size={15} /> Back to Portfolio
      </Link>
    </div>
  );

  const embedUrl = getYouTubeEmbedUrl(project.youtubeUrl ?? '');
  const tags = project.tags ? project.tags.split('/').map(t => t.trim()).filter(Boolean) : [];
  const hasStores = project.appStoreUrl || project.playStoreUrl;

  return (
    <div style={{ paddingTop: '70px' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .project-detail-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 3rem;
          align-items: start;
        }
        @media (max-width: 900px) {
          .project-detail-grid { grid-template-columns: 1fr; gap: 2rem; }
        }
        .store-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .action-link:hover { border-color: var(--primary); color: var(--primary-light); }
      `}</style>

      {/* Back bar */}
      <div className="container" style={{ padding: '1rem 1.5rem' }}>
        <Link href="/portfolio" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--muted)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, transition: 'color 0.2s' }}>
          <ArrowLeft size={15} /> Portfolio
        </Link>
      </div>

      {/* Hero band */}
      <div style={{ background: `linear-gradient(135deg, ${project.color}08, ${project.color}18)`, borderBottom: `1px solid ${project.color}22`, padding: '3rem 0' }}>
        <div className="container" style={{ padding: '0 1.5rem' }}>
          <span style={{ display: 'inline-block', padding: '0.25rem 0.85rem', background: `${project.color}20`, color: project.color, borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
            {project.category}
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'var(--foreground)', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.1 }}>
            {project.title}
          </h1>
          {tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
              {tags.map(tag => (
                <span key={tag} style={{ padding: '0.25rem 0.75rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '999px', fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600 }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <section className="section">
        <div className="container" style={{ padding: '3rem 1.5rem' }}>
          <div className="project-detail-grid">

            {/* LEFT — single unified media carousel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <MediaCarousel
                images={project.images ?? []}
                embedUrl={embedUrl}
                color={project.color}
                title={project.title}
              />

              {/* Description */}
              {project.description && (
                <div className="card" style={{ padding: '1.75rem' }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.85rem' }}>About the Project</h2>
                  <p style={{ color: 'var(--muted)', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>{project.description}</p>
                </div>
              )}
            </div>

            {/* RIGHT — sidebar info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Quick links */}
              {(project.projectUrl || project.githubUrl) && (
                <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: '0.25rem' }}>Links</div>
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-link"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.7rem 1rem', border: '1.5px solid var(--border)', borderRadius: '0.75rem', textDecoration: 'none', color: 'var(--foreground)', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s' }}
                    >
                      <Globe size={16} color={project.color} />
                      Live Demo
                      <ExternalLink size={12} style={{ marginLeft: 'auto', color: 'var(--muted)' }} />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-link"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.7rem 1rem', border: '1.5px solid var(--border)', borderRadius: '0.75rem', textDecoration: 'none', color: 'var(--foreground)', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s' }}
                    >
                      <GitFork size={16} />
                      View on GitHub
                      <ExternalLink size={12} style={{ marginLeft: 'auto', color: 'var(--muted)' }} />
                    </a>
                  )}
                </div>
              )}

              {/* Store buttons */}
              {hasStores && (
                <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: '0.25rem' }}>Download</div>
                  {project.appStoreUrl && (
                    <a
                      href={project.appStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="store-btn"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.1rem', background: '#000', borderRadius: '0.85rem', textDecoration: 'none', color: '#fff', transition: 'all 0.2s' }}
                    >
                      {/* Apple logo SVG */}
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                      <div>
                        <div style={{ fontSize: '0.65rem', opacity: 0.7, lineHeight: 1 }}>Download on the</div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.2 }}>App Store</div>
                      </div>
                    </a>
                  )}
                  {project.playStoreUrl && (
                    <a
                      href={project.playStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="store-btn"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.1rem', background: '#01875f', borderRadius: '0.85rem', textDecoration: 'none', color: '#fff', transition: 'all 0.2s' }}
                    >
                      {/* Play Store / Google Play icon SVG */}
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76a2 2 0 0 1-1.01-1.76V2A2 2 0 0 1 3.18.24l12.56 11.76L3.18 23.76zM16.15 13.5 5.75 24l10.4-5.5 2.72-2.54L16.15 13.5zm3.7-2.14-2.7-1.41L14.5 12l2.65 2.05 2.7-1.41a1.5 1.5 0 0 0 0-2.28zM5.75 0l10.4 10.5-2.62 2.47L5.75 0z" /></svg>
                      <div>
                        <div style={{ fontSize: '0.65rem', opacity: 0.7, lineHeight: 1 }}>Get it on</div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.2 }}>Google Play</div>
                      </div>
                    </a>
                  )}
                </div>
              )}

              {/* Details card */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: '1rem' }}>Details</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.2rem' }}>Category</div>
                    <div style={{ fontWeight: 700, color: project.color }}>{project.category}</div>
                  </div>
                  {project.tags && (
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Tech Stack</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {tags.map(t => (
                          <span key={t} style={{ padding: '0.2rem 0.6rem', background: `${project.color}12`, border: `1px solid ${project.color}30`, borderRadius: '999px', fontSize: '0.78rem', color: project.color, fontWeight: 600 }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {embedUrl && (
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.2rem' }}>Video Demo</div>
                      <a href={project.youtubeUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}>
                        <Play size={13} fill="#ef4444" /> Watch on YouTube
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div style={{ padding: '1.5rem', background: `linear-gradient(135deg, ${project.color}12, ${project.color}22)`, border: `1.5px solid ${project.color}30`, borderRadius: '1rem', textAlign: 'center' }}>
                <h3 style={{ fontWeight: 800, color: 'var(--foreground)', marginBottom: '0.5rem', fontSize: '1rem' }}>Like this project?</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1.1rem' }}>Let&apos;s build something great together.</p>
                <Link href="/contact" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', justifyContent: 'center', width: '100%', fontSize: '0.875rem' }}>
                  Start a Project
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
