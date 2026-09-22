'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  addDoc, updateDoc, doc, collection, serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadMultipleToCloudinary } from '@/lib/cloudinary';
import {
  CheckCircle, AlertTriangle, Loader2, Upload, X, ImagePlus,
} from 'lucide-react';

export interface ProjectData {
  id?: string;
  title: string;
  category: string;
  tags: string;
  description: string;
  color: string;
  projectUrl: string;
  githubUrl: string;
  images: string[];
}

const CATEGORIES = ['Web App', 'Design', 'Mobile', 'Open Source', 'Backend', 'Other'];

const COLORS = [
  { label: 'Blue',   value: '#2563eb' },
  { label: 'Purple', value: '#7c3aed' },
  { label: 'Green',  value: '#059669' },
  { label: 'Red',    value: '#dc2626' },
  { label: 'Amber',  value: '#d97706' },
  { label: 'Cyan',   value: '#0891b2' },
  { label: 'Pink',   value: '#db2777' },
  { label: 'Orange', value: '#ea580c' },
];

interface ProjectFormProps {
  initialData?: ProjectData;
  mode: 'new' | 'edit';
}

export default function ProjectForm({ initialData, mode }: ProjectFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProjectData>({
    title:       initialData?.title       ?? '',
    category:    initialData?.category    ?? 'Web App',
    tags:        initialData?.tags        ?? '',
    description: initialData?.description ?? '',
    color:       initialData?.color       ?? '#2563eb',
    projectUrl:  initialData?.projectUrl  ?? '',
    githubUrl:   initialData?.githubUrl   ?? '',
    images:      initialData?.images      ?? [],
  });

  const [uploading, setUploading]     = useState(false);
  const [uploadProgress, setProgress] = useState({ done: 0, total: 0 });
  const [dragOver, setDragOver]       = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState(false);

  const set = (key: keyof ProjectData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }));

  /* ─── Image upload ──────────────────────────────────────── */
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArr = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (fileArr.length === 0) { setError('Please select image files only.'); return; }

    setUploading(true);
    setProgress({ done: 0, total: fileArr.length });
    setError('');

    try {
      const urls = await uploadMultipleToCloudinary(fileArr, (done, total) => {
        setProgress({ done, total });
      });
      setForm(prev => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed.');
    } finally {
      setUploading(false);
      setProgress({ done: 0, total: 0 });
      // Reset file input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (idx: number) =>
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  /* ─── Form submit ────────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required.'); return; }
    setLoading(true);
    setError('');
    try {
      if (mode === 'new') {
        await addDoc(collection(db, 'projects'), {
          ...form,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else if (mode === 'edit' && initialData?.id) {
        await updateDoc(doc(db, 'projects', initialData.id), {
          ...form,
          updatedAt: serverTimestamp(),
        });
      }
      setSuccess(true);
      setTimeout(() => router.push('/admin/projects'), 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  /* ─── Styles ─────────────────────────────────────────────── */
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'var(--surface-2)',
    border: '1.5px solid var(--border)',
    borderRadius: '0.65rem',
    color: 'var(--foreground)',
    fontSize: '0.95rem',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: 'var(--foreground)',
    marginBottom: '0.4rem',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title */}
      <div>
        <label style={labelStyle}>Project Title *</label>
        <input value={form.title} onChange={set('title')} placeholder="My Awesome Project" style={inputStyle} />
      </div>

      {/* Category */}
      <div>
        <label style={labelStyle}>Category</label>
        <select value={form.category} onChange={set('category')} style={{ ...inputStyle, cursor: 'pointer' }}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Accent Color */}
      <div>
        <label style={labelStyle}>Accent Color</label>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {COLORS.map(c => (
            <button
              key={c.value}
              type="button"
              onClick={() => setForm(prev => ({ ...prev, color: c.value }))}
              title={c.label}
              style={{
                width: '30px', height: '30px',
                borderRadius: '50%',
                background: c.value,
                border: form.color === c.value ? '3px solid var(--foreground)' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'transform 0.15s',
                transform: form.color === c.value ? 'scale(1.25)' : 'scale(1)',
                outline: 'none',
              }}
            />
          ))}
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)', marginLeft: '0.25rem' }}>
            {COLORS.find(c => c.value === form.color)?.label}
          </span>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label style={labelStyle}>Tech Stack / Tags</label>
        <input value={form.tags} onChange={set('tags')} placeholder="Next.js / TypeScript / Tailwind" style={inputStyle} />
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle}>Description</label>
        <textarea
          value={form.description}
          onChange={set('description')}
          rows={4}
          placeholder="Briefly describe what this project does..."
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      {/* URLs row */}
      <div className="admin-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Live URL</label>
          <input value={form.projectUrl} onChange={set('projectUrl')} placeholder="https://..." style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>GitHub URL</label>
          <input value={form.githubUrl} onChange={set('githubUrl')} placeholder="https://github.com/..." style={inputStyle} />
        </div>
      </div>

      {/* ── Images ─────────────────────────────────────────── */}
      <div>
        <label style={labelStyle}>Project Images</label>

        {/* Drop Zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? 'var(--primary)' : 'var(--border)'}`,
            borderRadius: '0.85rem',
            padding: '2rem 1rem',
            textAlign: 'center',
            cursor: uploading ? 'not-allowed' : 'pointer',
            background: dragOver ? 'rgba(37,99,235,0.05)' : 'var(--surface-2)',
            transition: 'all 0.2s',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={e => handleFiles(e.target.files)}
          />

          {uploading ? (
            <div>
              <Loader2 size={28} color="var(--primary)" style={{ animation: 'spin 0.7s linear infinite', margin: '0 auto 0.75rem', display: 'block' }} />
              <p style={{ color: 'var(--primary)', fontWeight: 600, margin: '0 0 0.25rem', fontSize: '0.9rem' }}>
                Uploading {uploadProgress.done} / {uploadProgress.total} images…
              </p>
              {/* Progress bar */}
              <div style={{ height: '4px', background: 'var(--border)', borderRadius: '99px', margin: '0.75rem auto 0', maxWidth: '200px' }}>
                <div style={{
                  height: '100%',
                  width: `${uploadProgress.total ? (uploadProgress.done / uploadProgress.total) * 100 : 0}%`,
                  background: 'var(--primary)',
                  borderRadius: '99px',
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>
          ) : (
            <>
              <ImagePlus size={28} color="var(--muted)" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
              <p style={{ color: 'var(--foreground)', fontWeight: 600, margin: '0 0 0.25rem', fontSize: '0.9rem' }}>
                Drop images here or click to browse
              </p>
              <p style={{ color: 'var(--muted)', fontSize: '0.8rem', margin: 0 }}>
                PNG, JPG, WebP — multiple files supported
              </p>
            </>
          )}
        </div>

        {/* Image Previews */}
        {form.images.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: '0.65rem',
            marginTop: '0.85rem',
          }}>
            {form.images.map((url, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  borderRadius: '0.6rem',
                  overflow: 'hidden',
                  aspectRatio: '1',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Project image ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  style={{
                    position: 'absolute', top: '4px', right: '4px',
                    width: '22px', height: '22px',
                    background: 'rgba(0,0,0,0.65)',
                    border: 'none',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff',
                    padding: 0,
                    transition: 'background 0.15s',
                  }}
                  title="Remove image"
                >
                  <X size={12} />
                </button>
                {idx === 0 && (
                  <div style={{
                    position: 'absolute', bottom: '4px', left: '4px',
                    fontSize: '0.6rem', fontWeight: 700,
                    background: 'var(--primary)',
                    color: '#fff',
                    padding: '1px 5px',
                    borderRadius: '3px',
                  }}>COVER</div>
                )}
              </div>
            ))}
            {/* Add more button */}
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              style={{
                borderRadius: '0.6rem',
                border: '2px dashed var(--border)',
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                background: 'var(--surface-2)',
                transition: 'border-color 0.2s',
                flexDirection: 'column',
                gap: '0.25rem',
              }}
            >
              <Upload size={16} color="var(--muted)" />
              <span style={{ fontSize: '0.65rem', color: 'var(--muted)', fontWeight: 600 }}>Add More</span>
            </div>
          </div>
        )}
      </div>

      {/* Error / Success */}
      {error && (
        <div style={{ padding: '0.75rem 1rem', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '0.65rem', color: '#ef4444', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={15} /> {error}
        </div>
      )}
      {success && (
        <div style={{ padding: '0.75rem 1rem', background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.3)', borderRadius: '0.65rem', color: '#10b981', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={15} /> Project saved! Redirecting…
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || uploading}
        className="btn-primary"
        style={{ justifyContent: 'center', opacity: loading || uploading ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
      >
        {loading
          ? <><Loader2 size={15} style={{ animation: 'spin 0.7s linear infinite' }} /> Saving…</>
          : uploading
            ? <><Loader2 size={15} style={{ animation: 'spin 0.7s linear infinite' }} /> Uploading images…</>
            : mode === 'new' ? 'Add Project' : 'Save Changes'
        }
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}
