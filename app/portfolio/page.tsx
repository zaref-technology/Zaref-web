'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Globe, GitFork, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  tags: string;
  description: string;
  color: string;
  projectUrl: string;
  githubUrl: string;
  images: string[];
}

/* ── Mini image carousel for project cards ─────────────────── */
function ProjectThumbnail({ project }: { project: Project }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const images = project.images ?? [];

  if (images.length === 0) {
    // Fallback: colour gradient with category initial
    return (
      <div style={{
        height: '200px',
        borderRadius: '0.75rem 0.75rem 0 0',
        background: `linear-gradient(135deg, ${project.color}18, ${project.color}44)`,
        border: `1px solid ${project.color}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', width: '120px', height: '120px', borderRadius: '50%', border: `1.5px solid ${project.color}33`, top: '-30px', right: '-30px' }} />
        <div style={{ position: 'absolute', width: '80px', height: '80px', borderRadius: '50%', border: `1.5px solid ${project.color}22`, bottom: '-20px', left: '-20px' }} />
        <div style={{
          width: '64px', height: '64px', borderRadius: '16px',
          background: `${project.color}22`,
          border: `1.5px solid ${project.color}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.6rem', fontWeight: 800, color: project.color, zIndex: 1,
        }}>
          {project.category?.charAt(0) ?? 'P'}
        </div>
      </div>
    );
  }

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx(i => (i - 1 + images.length) % images.length);
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx(i => (i + 1) % images.length);
  };

  return (
    <div style={{ position: 'relative', height: '200px', borderRadius: '0.75rem 0.75rem 0 0', overflow: 'hidden', background: 'var(--surface-2)' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[activeIdx]}
        alt={`${project.title} screenshot ${activeIdx + 1}`}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 0.25s' }}
      />

      {/* Gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)', pointerEvents: 'none' }} />

      {/* Nav arrows — only if multiple images */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            style={{
              position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)',
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', backdropFilter: 'blur(4px)',
            }}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={next}
            style={{
              position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', backdropFilter: 'blur(4px)',
            }}
          >
            <ChevronRight size={14} />
          </button>

          {/* Dot indicators */}
          <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '5px' }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setActiveIdx(i); }}
                style={{
                  width: i === activeIdx ? '18px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: i === activeIdx ? '#fff' : 'rgba(255,255,255,0.5)',
                  border: 'none', padding: 0, cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>

          {/* Image counter badge */}
          <div style={{
            position: 'absolute', top: '8px', right: '8px',
            fontSize: '0.68rem', fontWeight: 700,
            background: 'rgba(0,0,0,0.55)', color: '#fff',
            backdropFilter: 'blur(4px)',
            padding: '2px 7px', borderRadius: '99px',
          }}>
            {activeIdx + 1}/{images.length}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Main Portfolio Page ────────────────────────────────────── */
export default function Portfolio() {
  const [projects, setProjects]             = useState<Project[]>([]);
  const [loading, setLoading]               = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    async function fetchProjects() {
      try {
        const snap = await getDocs(query(collection(db, 'projects'), orderBy('createdAt', 'desc')));
        setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() } as Project)));
      } catch (err) {
        console.error('Portfolio fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];
  const filtered   = activeCategory === 'All' ? projects : projects.filter(p => p.category === activeCategory);

  return (
    <div style={{ paddingTop: '70px' }}>
      {/* Header */}
      <section style={{ position: 'relative', padding: '6rem 0 5rem', overflow: 'hidden', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="glow-blob" style={{ width: '500px', height: '500px', background: 'var(--primary)', top: '-200px', left: '-100px' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="badge" style={{ margin: '0 auto 1rem' }}>Portfolio</div>
          <h1 className="section-title" style={{ margin: '0 auto 1rem' }}>Selected Work</h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            A curated collection of projects spanning web apps, design systems, and open source.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section style={{ padding: '2.5rem 0 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '3rem' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '999px',
                  border: '1.5px solid',
                  borderColor: activeCategory === cat ? 'var(--primary)' : 'var(--border)',
                  background: activeCategory === cat ? 'var(--primary)' : 'transparent',
                  color: activeCategory === cat ? '#fff' : 'var(--muted)',
                  fontWeight: 600, fontSize: '0.875rem',
                  cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', padding: '0 0 5rem' }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="card" style={{ height: '340px', animation: 'pulse 1.5s ease-in-out infinite', padding: 0, overflow: 'hidden' }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
              <h2 style={{ fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.5rem' }}>
                {projects.length === 0 ? 'No projects yet' : 'No projects in this category'}
              </h2>
              <p style={{ color: 'var(--muted)' }}>
                {projects.length === 0 ? 'Check back soon!' : 'Try selecting a different category.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', padding: '0 0 5rem' }}>
              {filtered.map(proj => (
                <article
                  key={proj.id}
                  className="card"
                  style={{ overflow: 'hidden', padding: 0, height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                >
                  <Link
                    href={`/portfolio/${proj.id}`}
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block', flex: 1 }}
                  >
                    {/* Image carousel / fallback thumbnail */}
                    <ProjectThumbnail project={proj} />

                    {/* Meta */}
                    <div style={{ padding: '1.25rem 1.25rem 0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{
                            display: 'inline-block', padding: '0.2rem 0.7rem',
                            background: `${proj.color}18`, color: proj.color,
                            borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
                            marginBottom: '0.5rem',
                          }}>
                            {proj.category}
                          </span>
                          <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--foreground)', marginBottom: '0.25rem' }}>
                            {proj.title}
                          </h3>
                          <p style={{ color: 'var(--muted)', fontSize: '0.825rem', marginBottom: '0.4rem' }}>{proj.tags}</p>
                          {proj.description && (
                            <p style={{
                              color: 'var(--muted)', fontSize: '0.82rem', lineHeight: 1.6,
                              display: '-webkit-box', WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical', overflow: 'hidden',
                              marginBottom: '0.5rem',
                            }}>
                              {proj.description}
                            </p>
                          )}
                        </div>
                        <div style={{ color: 'var(--primary-light)', flexShrink: 0, marginTop: '0.25rem' }}>
                          <ExternalLink size={16} />
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* External Links outside main Link */}
                  {(proj.projectUrl || proj.githubUrl) && (
                    <div style={{ padding: '0 1.25rem 1.25rem', marginTop: 'auto', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      {proj.projectUrl && (
                        <a href={proj.projectUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Globe size={12} /> Live Demo
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--muted)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <GitFork size={12} /> GitHub
                        </a>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
