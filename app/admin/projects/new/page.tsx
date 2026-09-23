import Link from 'next/link';
import ProjectForm from '../../components/ProjectForm';
import { ChevronRight } from 'lucide-react';

export default function NewProjectPage() {
  return (
    <div style={{ maxWidth: '860px', width: '100%' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--muted)' }}>
        <Link href="/admin/projects" style={{ color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 600 }}>Projects</Link>
        <ChevronRight size={14} />
        <span>New Project</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.9rem)', fontWeight: 800, color: 'var(--foreground)', margin: '0 0 0.35rem' }}>Add New Project</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Fill in the details below to add a project to your portfolio.</p>

      <div className="card" style={{ padding: '1.5rem', maxWidth: '100%' }}>
        <ProjectForm mode="new" />
      </div>
    </div>
  );
}
