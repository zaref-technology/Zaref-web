'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FolderKanban, ArrowRight, ExternalLink } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  tags?: string;
  description?: string;
  color?: string;
  projectUrl?: string;
  githubUrl?: string;
  images?: string[];
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const snap = await getDocs(
          query(collection(db, 'projects'), limit(4))
        );
        setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() } as Project)));
      } catch (err) {
        console.error('ProjectsSection fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <section className="section" style={{ background: 'var(--surface-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <style>{`
        .projects-scroll-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 1024px) {
          .projects-scroll-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .projects-scroll-row {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 1rem;
            gap: 1rem;
          }
          .projects-scroll-row::-webkit-scrollbar { height: 4px; }
          .projects-scroll-row::-webkit-scrollbar-track { background: transparent; }
          .projects-scroll-row::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
        }
        .project-card-wrap {
          flex: 0 0 280px;
          scroll-snap-align: start;
        }
        @media (min-width: 641px) {
          .project-card-wrap {
            flex: unset;
          }
        }
        .project-card {
          height: 100%;
          display: flex;
          flex-direction: column;
          border-radius: 1rem;
          overflow: hidden;
          background: var(--surface);
          border: 1px solid var(--border);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .project-card:hover {
          transform: translateY(-4px);
          border-color: var(--primary-light);
          box-shadow: 0 12px 28px rgba(0,0,0,0.25);
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      <div className="container">
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
          <div>
            <div className="badge" style={{ marginBottom: '0.75rem' }}>Selected Work</div>
            <h2 className="section-title" style={{ margin: 0 }}>Featured Projects</h2>
            <p className="section-subtitle" style={{ margin: '0.5rem 0 0', maxWidth: '480px' }}>
              Explore our recent projects crafted with precision, quality, and modern technology.
            </p>
          </div>
          <Link
            href="/portfolio"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.6rem 1.25rem',
              border: '1.5px solid var(--border)',
              borderRadius: '999px',
              color: 'var(--foreground)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              background: 'transparent',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {/* Cards Row */}
        {loading ? (
          <div className="projects-scroll-row">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="project-card-wrap">
                <div className="card" style={{ height: '320px', animation: 'pulse 1.5s ease-in-out infinite', padding: 0, borderRadius: '1rem' }} />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--muted)' }}>
            <FolderKanban size={36} style={{ margin: '0 auto 0.75rem', display: 'block', opacity: 0.3 }} />
            <p>No projects showcased yet — add projects in the admin panel.</p>
          </div>
        ) : (
          <div className="projects-scroll-row">
            {projects.map(proj => {
              const accentColor = proj.color || '#6366f1';
              const firstImg = proj.images && proj.images.length > 0 ? proj.images[0] : null;

              return (
                <div key={proj.id} className="project-card-wrap">
                  <Link href={`/portfolio/${proj.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                    <article className="project-card">
                      {/* Image or fallback container */}
                      <div style={{
                        height: '170px',
                        width: '100%',
                        position: 'relative',
                        overflow: 'hidden',
                        background: firstImg ? 'var(--surface-2)' : `linear-gradient(135deg, ${accentColor}22, ${accentColor}44)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {firstImg ? (
                          <img
                            src={firstImg}
                            alt={proj.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{
                            width: '54px', height: '54px', borderRadius: '14px',
                            background: `${accentColor}33`, border: `1.5px solid ${accentColor}66`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.4rem', fontWeight: 800, color: accentColor,
                          }}>
                            {proj.category?.charAt(0) ?? 'P'}
                          </div>
                        )}
                        {/* Category Badge */}
                        <span style={{
                          position: 'absolute', top: '0.75rem', left: '0.75rem',
                          padding: '0.25rem 0.65rem',
                          background: 'rgba(0, 0, 0, 0.65)',
                          backdropFilter: 'blur(8px)',
                          color: '#fff',
                          borderRadius: '999px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          letterSpacing: '0.02em',
                        }}>
                          {proj.category || 'Project'}
                        </span>
                      </div>

                      {/* Content */}
                      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                          {proj.title}
                        </h3>

                        {proj.description && (
                          <p style={{
                            fontSize: '0.83rem', color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 1rem',
                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                          }}>
                            {proj.description}
                          </p>
                        )}

                        <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'between' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            View Details <ArrowRight size={12} />
                          </span>
                          <ExternalLink size={14} style={{ color: 'var(--muted)', marginLeft: 'auto' }} />
                        </div>
                      </div>
                    </article>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
