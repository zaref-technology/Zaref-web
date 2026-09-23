'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus, Pencil, Trash2, Globe, GitFork,
  Calendar, FolderOpen,
} from 'lucide-react';
import { listProjects, deleteProject } from '@/services/projects.service';
import { triggerRevalidate } from '@/lib/revalidate';
import type { Project } from '@/types/project';

export default function ProjectsPage() {
  const [projects, setProjects]   = useState<Project[]>([]);
  const [loading, setLoading]     = useState(true);
  const [deleting, setDeleting]   = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setProjects(await listProjects({ includeDrafts: true }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const slug = projects.find(p => p.id === id)?.slug;
      await deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      await triggerRevalidate([
        { path: '/' },
        { path: '/work' },
        ...(slug ? [{ path: `/work/${slug}` }] : []),
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
      setConfirmId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', fontWeight: 800, color: 'var(--foreground)', margin: '0 0 0.35rem' }}>Projects</h1>
          <p style={{ color: 'var(--muted)', margin: 0, fontSize: '0.9rem' }}>
            {projects.length} project{projects.length !== 1 ? 's' : ''} in your portfolio
          </p>
        </div>
        <Link href="/admin/projects/new" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <Plus size={16} /> Add Project
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="admin-projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card" style={{ height: '300px', animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <FolderOpen size={48} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.3, color: 'var(--muted)' }} />
          <h2 style={{ fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.5rem' }}>No projects yet</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Add your first portfolio project to get started.</p>
          <Link href="/admin/projects/new" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={16} /> Add Your First Project
          </Link>
        </div>
      ) : (
        <div className="admin-projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {projects.map(proj => (
            <div key={proj.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>

              {/* ── Thumbnail ── */}
              <div style={{ position: 'relative', height: '150px', overflow: 'hidden', flexShrink: 0 }}>
                {proj.images?.[0] ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={proj.images[0]}
                      alt={proj.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent 60%)', pointerEvents: 'none' }} />
                    {proj.images.length > 1 && (
                      <span style={{
                        position: 'absolute', top: '8px', right: '8px',
                        fontSize: '0.65rem', fontWeight: 700,
                        background: 'rgba(0,0,0,0.55)', color: '#fff',
                        backdropFilter: 'blur(4px)',
                        padding: '2px 7px', borderRadius: '99px',
                      }}>
                        {proj.images.length} photos
                      </span>
                    )}
                  </>
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    background: `linear-gradient(135deg, ${proj.color}22, ${proj.color}55)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <FolderOpen size={32} color={proj.color} style={{ opacity: 0.6 }} />
                  </div>
                )}
                {/* Colour accent bar */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: proj.color }} />
              </div>

              {/* ── Card Body ── */}
              <div style={{ padding: '1.1rem' }}>

                {/* Title + Category */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '0.975rem', color: 'var(--foreground)', margin: 0, lineHeight: 1.3 }}>
                    {proj.title}
                  </h3>
                  <span style={{
                    display: 'inline-block', padding: '0.15rem 0.55rem', flexShrink: 0,
                    background: `${proj.color}20`, color: proj.color,
                    borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600,
                  }}>
                    {proj.category}
                  </span>
                </div>

                {proj.status === 'draft' && (
                  <span style={{
                    display: 'inline-block', marginBottom: '0.5rem', padding: '0.1rem 0.5rem',
                    background: 'rgba(217,119,6,0.12)', color: '#d97706',
                    borderRadius: '999px', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
                  }}>
                    Draft
                  </span>
                )}

                {proj.tags && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: '0 0 0.5rem' }}>{proj.tags}</p>
                )}

                {proj.description && (
                  <p style={{
                    fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.6,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    overflow: 'hidden', margin: '0 0 0.75rem',
                  }}>
                    {proj.description}
                  </p>
                )}

                {/* Links */}
                {(proj.projectUrl || proj.githubUrl) && (
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.85rem' }}>
                    {proj.projectUrl && (
                      <a href={proj.projectUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.78rem', color: 'var(--primary-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Globe size={12} /> Live
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.78rem', color: 'var(--muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <GitFork size={12} /> GitHub
                      </a>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link
                    href={`/admin/projects/${proj.id}/edit`}
                    style={{
                      flex: 1, padding: '0.55rem 0', textAlign: 'center',
                      background: 'var(--surface-2)', border: '1px solid var(--border)',
                      borderRadius: '0.6rem', color: 'var(--foreground)', fontSize: '0.85rem',
                      fontWeight: 600, textDecoration: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Pencil size={13} /> Edit
                  </Link>

                  {confirmId === proj.id ? (
                    <div style={{ flex: 1, display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => handleDelete(proj.id)}
                        disabled={deleting === proj.id}
                        style={{ flex: 1, padding: '0.55rem 0', background: '#dc2626', border: 'none', borderRadius: '0.6rem', color: '#fff', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        {deleting === proj.id ? '…' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        style={{ flex: 1, padding: '0.55rem 0', background: 'transparent', border: '1px solid var(--border)', borderRadius: '0.6rem', color: 'var(--muted)', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(proj.id)}
                      style={{ padding: '0.55rem 0.85rem', background: 'transparent', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '0.6rem', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {/* Date */}
                {proj.createdAt && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }}>
                    <Calendar size={10} /> {new Date(proj.createdAt.seconds * 1000).toLocaleDateString()}
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
