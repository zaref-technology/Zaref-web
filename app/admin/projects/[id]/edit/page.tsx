'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProjectForm, { type ProjectFormData } from '../../../components/ProjectForm';
import { use } from 'react';
import { ChevronRight, Trash2, Loader2, Search } from 'lucide-react';
import { getProject, deleteProject } from '@/services/projects.service';
import { triggerRevalidate } from '@/lib/revalidate';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditProjectPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [project, setProject]         = useState<ProjectFormData | null>(null);
  const [loading, setLoading]         = useState(true);
  const [notFound, setNotFound]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting]       = useState(false);

  useEffect(() => {
    async function fetchProject() {
      try {
        const data = await getProject(id);
        if (!data) { setNotFound(true); return; }
        setProject(data);
      } catch (err) {
        console.error(err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProject(id);
      await triggerRevalidate([
        { path: '/' },
        { path: '/work' },
        ...(project?.slug ? [{ path: `/work/${project.slug}` }] : []),
      ]);
      router.replace('/admin/projects');
    } catch (err) {
      console.error(err);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '0.75rem', color: 'var(--muted)' }}>
        <Loader2 size={24} style={{ animation: 'spin 0.7s linear infinite' }} />
        <span>Loading project…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <Search size={48} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.3, color: 'var(--muted)' }} />
        <h2 style={{ color: 'var(--foreground)', marginBottom: '0.5rem' }}>Project not found</h2>
        <Link href="/admin/projects" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '860px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2rem', fontSize: '0.875rem', color: 'var(--muted)' }}>
        <Link href="/admin/projects" style={{ color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 600 }}>Projects</Link>
        <ChevronRight size={14} />
        <span>Edit</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--foreground)', margin: '0 0 0.35rem' }}>Edit Project</h1>
          <p style={{ color: 'var(--muted)', margin: 0 }}>{project?.title}</p>
        </div>
        <button
          onClick={() => setShowConfirm(true)}
          style={{
            padding: '0.6rem 1.25rem',
            background: 'rgba(220,38,38,0.08)',
            border: '1px solid rgba(220,38,38,0.35)',
            borderRadius: '0.75rem',
            color: '#ef4444',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            fontFamily: 'inherit',
            transition: 'all 0.2s',
          }}
        >
          <Trash2 size={14} /> Delete Project
        </button>
      </div>

      {/* Delete confirm modal */}
      {showConfirm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
          <div className="card" style={{ maxWidth: '380px', width: '100%', padding: '2rem', textAlign: 'center' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <Trash2 size={22} color="#ef4444" />
            </div>
            <h3 style={{ fontWeight: 800, color: 'var(--foreground)', marginBottom: '0.5rem' }}>Delete &quot;{project?.title}&quot;?</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>This action cannot be undone. The project will be permanently removed.</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={() => setShowConfirm(false)} style={{ padding: '0.65rem 1.5rem', background: 'transparent', border: '1.5px solid var(--border)', borderRadius: '0.65rem', color: 'var(--muted)', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{ padding: '0.65rem 1.5rem', background: '#dc2626', border: 'none', borderRadius: '0.65rem', color: '#fff', cursor: deleting ? 'not-allowed' : 'pointer', fontWeight: 700, opacity: deleting ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'inherit' }}
              >
                {deleting ? <><Loader2 size={14} style={{ animation: 'spin 0.7s linear infinite' }} /> Deleting…</> : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: '2rem' }}>
        {project && <ProjectForm mode="edit" initialData={project} />}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
