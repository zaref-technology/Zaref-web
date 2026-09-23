'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle, AlertTriangle, Loader2, Upload, X, ImagePlus, Plus, ChevronUp, ChevronDown,
} from 'lucide-react';
import { uploadMultipleToCloudinary } from '@/lib/cloudinary';
import { createProject, updateProject, isSlugTaken } from '@/services/projects.service';
import { PROJECT_CATEGORIES, PROJECT_ACCENT_COLORS, SOLUTION_TYPES } from '@/constants/project';
import { CAPABILITIES } from '@/constants/capabilities';
import { triggerRevalidate } from '@/lib/revalidate';
import { slugify } from '@/lib/slug';
import type { ProjectInput, ProjectFeature, GalleryItem } from '@/types/project';

/** Form state shape — a ProjectInput plus an optional id, present only in edit mode. */
export type ProjectFormData = ProjectInput & { id?: string };

interface ProjectFormProps {
  initialData?: ProjectFormData;
  mode: 'new' | 'edit';
}

/* ─── Shared styles ────────────────────────────────────────────── */
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

const helperStyle: React.CSSProperties = {
  fontSize: '0.78rem',
  color: 'var(--muted)',
  marginTop: '0.35rem',
};

const sectionStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  paddingBottom: '2rem',
  marginBottom: '2rem',
  borderBottom: '1px solid var(--border)',
};

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--foreground)', margin: '0 0 0.25rem' }}>{title}</h2>
      {subtitle && <p style={{ fontSize: '0.82rem', color: 'var(--muted)', margin: 0 }}>{subtitle}</p>}
    </div>
  );
}

/* ─── Chip input — for technologies / platforms / integrations ───── */
function ChipInput({ label, placeholder, helper, values, onChange }: {
  label: string;
  placeholder: string;
  helper?: string;
  values: string[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState('');

  const commit = () => {
    const v = draft.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setDraft('');
  };

  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); commit(); }
          }}
          placeholder={placeholder}
          style={inputStyle}
        />
        <button
          type="button"
          onClick={commit}
          style={{
            flexShrink: 0, padding: '0 1rem', borderRadius: '0.65rem',
            border: '1.5px solid var(--border)', background: 'var(--surface-2)',
            color: 'var(--foreground)', fontWeight: 700, cursor: 'pointer',
          }}
        >
          Add
        </button>
      </div>
      {values.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.65rem' }}>
          {values.map(v => (
            <span
              key={v}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.3rem 0.4rem 0.3rem 0.75rem', borderRadius: '999px',
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                fontSize: '0.82rem', fontWeight: 600, color: 'var(--foreground)',
              }}
            >
              {v}
              <button
                type="button"
                onClick={() => onChange(values.filter(x => x !== v))}
                style={{ display: 'flex', width: '16px', height: '16px', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: 'none', background: 'var(--border)', color: 'var(--muted)', cursor: 'pointer' }}
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}
      {helper && <p style={helperStyle}>{helper}</p>}
    </div>
  );
}

export default function ProjectForm({ initialData, mode }: ProjectFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProjectFormData>({
    title:             initialData?.title             ?? '',
    slug:              initialData?.slug               ?? '',
    shortDescription:  initialData?.shortDescription   ?? '',
    status:            initialData?.status             ?? 'published',
    featured:          initialData?.featured           ?? false,
    displayOrder:      initialData?.displayOrder,
    category:          initialData?.category           ?? 'Web Application',
    capabilityIds:     initialData?.capabilityIds       ?? [],
    solutionType:      initialData?.solutionType        ?? '',
    industry:          initialData?.industry            ?? '',
    clientName:        initialData?.clientName          ?? '',
    projectYear:       initialData?.projectYear         ?? '',
    tags:              initialData?.tags               ?? '',
    description:       initialData?.description        ?? '',
    challenge:         initialData?.challenge           ?? '',
    solution:          initialData?.solution            ?? initialData?.approach ?? '',
    approach:          initialData?.approach            ?? '',
    role:              initialData?.role                ?? '',
    outcome:           initialData?.outcome             ?? '',
    features:          initialData?.features            ?? [],
    technologies:      initialData?.technologies        ?? [],
    platforms:         initialData?.platforms           ?? [],
    integrations:      initialData?.integrations        ?? [],
    color:             initialData?.color               ?? '#2563eb',
    projectUrl:        initialData?.projectUrl          ?? '',
    githubUrl:         initialData?.githubUrl           ?? '',
    youtubeUrl:        initialData?.youtubeUrl          ?? '',
    appStoreUrl:       initialData?.appStoreUrl         ?? '',
    playStoreUrl:      initialData?.playStoreUrl        ?? '',
    images:            initialData?.images              ?? [],
    gallery:           initialData?.gallery             ?? (initialData?.images ?? []).map((url, i) => ({ url, alt: '', caption: '', order: i })),
  });

  const [uploading, setUploading]     = useState(false);
  const [uploadProgress, setProgress] = useState({ done: 0, total: 0 });
  const [dragOver, setDragOver]       = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState(false);
  // Once the admin edits the slug field directly, title changes stop auto-updating it — this
  // is what keeps a published project's URL stable when marketing copy changes later.
  const [slugTouched, setSlugTouched] = useState(mode === 'edit' && !!initialData?.slug);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm(prev => ({ ...prev, title, slug: slugTouched ? prev.slug : slugify(title) }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugTouched(true);
    setForm(prev => ({ ...prev, slug: e.target.value }));
  };

  const set = (key: keyof ProjectFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }));

  /* ─── Image / gallery upload ────────────────────────────────── */
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
      setForm(prev => {
        const images = [...prev.images, ...urls];
        const gallery: GalleryItem[] = [
          ...(prev.gallery ?? []),
          ...urls.map((url, i) => ({ url, alt: '', caption: '', order: (prev.gallery?.length ?? 0) + i })),
        ];
        return { ...prev, images, gallery };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed.');
    } finally {
      setUploading(false);
      setProgress({ done: 0, total: 0 });
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (idx: number) =>
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
      gallery: (prev.gallery ?? []).filter((_, i) => i !== idx),
    }));

  const updateGalleryMeta = (idx: number, key: 'alt' | 'caption', value: string) =>
    setForm(prev => ({
      ...prev,
      gallery: (prev.gallery ?? []).map((g, i) => (i === idx ? { ...g, [key]: value } : g)),
    }));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  /* ─── Capabilities ───────────────────────────────────────────── */
  const toggleCapability = (slug: string) =>
    setForm(prev => {
      const current = prev.capabilityIds ?? [];
      const next = current.includes(slug) ? current.filter(c => c !== slug) : [...current, slug];
      return { ...prev, capabilityIds: next };
    });

  /* ─── Features ───────────────────────────────────────────────── */
  const addFeature = () =>
    setForm(prev => ({
      ...prev,
      features: [...(prev.features ?? []), { title: '', description: '', order: (prev.features?.length ?? 0) } as ProjectFeature],
    }));

  const updateFeature = (idx: number, key: 'title' | 'description', value: string) =>
    setForm(prev => ({
      ...prev,
      features: (prev.features ?? []).map((f, i) => (i === idx ? { ...f, [key]: value } : f)),
    }));

  const removeFeature = (idx: number) =>
    setForm(prev => ({ ...prev, features: (prev.features ?? []).filter((_, i) => i !== idx) }));

  const moveFeature = (idx: number, dir: -1 | 1) =>
    setForm(prev => {
      const list = [...(prev.features ?? [])];
      const target = idx + dir;
      if (target < 0 || target >= list.length) return prev;
      [list[idx], list[target]] = [list[target], list[idx]];
      return { ...prev, features: list.map((f, i) => ({ ...f, order: i })) };
    });

  /* ─── Form submit ────────────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required.'); return; }
    setLoading(true);
    setError('');
    try {
      // A slug that's empty (legacy project never backfilled) gets one generated now; an
      // already-set slug is never silently regenerated from the current title.
      const slug = slugify(form.slug || form.title);
      if (!slug) { setError('Could not generate a valid slug from the title — please set one manually.'); setLoading(false); return; }
      if (await isSlugTaken(slug, initialData?.id)) {
        setError(`The slug "${slug}" is already used by another project. Please choose a different one.`);
        setLoading(false);
        return;
      }

      const payload: ProjectFormData = {
        ...form,
        slug,
        features: (form.features ?? []).filter(f => f.title.trim() || f.description.trim()),
        gallery: (form.gallery ?? []).map((g, i) => ({ ...g, order: i })),
      };
      if (mode === 'new') {
        await createProject(payload);
        await triggerRevalidate([{ path: '/' }, { path: '/work' }]);
      } else if (mode === 'edit' && initialData?.id) {
        await updateProject(initialData.id, payload);
        await triggerRevalidate([{ path: '/' }, { path: '/work' }, { path: `/work/${slug}` }]);
      }
      setSuccess(true);
      setTimeout(() => router.push('/admin/projects'), 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  // Legacy category values must remain selectable even if not in the current option list.
  const categoryOptions = PROJECT_CATEGORIES.includes(form.category as typeof PROJECT_CATEGORIES[number])
    ? PROJECT_CATEGORIES
    : [form.category, ...PROJECT_CATEGORIES];

  const solutionTypeOptions = form.solutionType && !SOLUTION_TYPES.includes(form.solutionType as typeof SOLUTION_TYPES[number])
    ? [form.solutionType, ...SOLUTION_TYPES]
    : SOLUTION_TYPES;

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>

      {/* ═══ 1. BASIC INFORMATION ═══ */}
      <div style={sectionStyle}>
        <SectionHeading title="Basic Information" />

        <div>
          <label style={labelStyle}>Project Title *</label>
          <input value={form.title} onChange={handleTitleChange} placeholder="My Awesome Project" style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>URL Slug {mode === 'new' && '(auto-generated — you can edit it)'}</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>/work/</span>
            <input value={form.slug} onChange={handleSlugChange} placeholder="auto-generated-from-title" style={inputStyle} />
          </div>
          {mode === 'edit' && (
            <p style={{ ...helperStyle, color: '#d97706' }}>
              Changing this value changes the project&apos;s public URL. Existing links, bookmarks and search results pointing to the old URL will break unless redirected.
            </p>
          )}
        </div>

        <div>
          <label style={labelStyle}>Short Description</label>
          <input
            value={form.shortDescription}
            onChange={set('shortDescription')}
            placeholder="One sentence for cards — falls back to the first line of Overview if left blank"
            style={inputStyle}
          />
        </div>

        <div className="admin-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={labelStyle}>Status</label>
            <select value={form.status} onChange={set('status')} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Featured</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 0', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={!!form.featured}
                onChange={e => setForm(prev => ({ ...prev, featured: e.target.checked }))}
                style={{ width: '17px', height: '17px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Show on homepage</span>
            </label>
          </div>
          <div>
            <label style={labelStyle}>Display Order</label>
            <input
              type="number"
              value={form.displayOrder ?? ''}
              onChange={e => setForm(prev => ({ ...prev, displayOrder: e.target.value === '' ? undefined : Number(e.target.value) }))}
              placeholder="0"
              style={inputStyle}
            />
          </div>
        </div>
        <p style={helperStyle}>Featured projects appear first on the homepage, ordered by Display Order (lowest first).</p>
      </div>

      {/* ═══ 2. CLASSIFICATION ═══ */}
      <div style={sectionStyle}>
        <SectionHeading title="Classification" subtitle="How this project fits into Zaref's service architecture." />

        <div>
          <label style={labelStyle}>Product / Platform Type</label>
          <select value={form.category} onChange={set('category')} style={{ ...inputStyle, cursor: 'pointer' }}>
            {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Zaref Capabilities</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.6rem' }}>
            {CAPABILITIES.map(cap => (
              <label
                key={cap.slug}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 0.85rem',
                  borderRadius: '0.65rem', border: `1.5px solid ${(form.capabilityIds ?? []).includes(cap.slug) ? 'var(--primary)' : 'var(--border)'}`,
                  background: (form.capabilityIds ?? []).includes(cap.slug) ? 'rgba(37,99,235,0.06)' : 'var(--surface-2)',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <input
                  type="checkbox"
                  checked={(form.capabilityIds ?? []).includes(cap.slug)}
                  onChange={() => toggleCapability(cap.slug)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer', flexShrink: 0 }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground)' }}>{cap.title}</span>
              </label>
            ))}
          </div>
          <p style={helperStyle}>Select every Zaref capability genuinely involved in this project. Shown as metadata on Selected Work — never guessed.</p>
        </div>

        <div className="admin-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Solution Type</label>
            <select value={form.solutionType} onChange={set('solutionType')} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">— None —</option>
              {solutionTypeOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Industry</label>
            <input value={form.industry} onChange={set('industry')} placeholder="e.g. Solar Energy, Retail, Logistics" style={inputStyle} />
          </div>
        </div>
      </div>

      {/* ═══ 3. CLIENT / PROJECT CONTEXT ═══ */}
      <div style={sectionStyle}>
        <SectionHeading title="Client / Project Context" subtitle="Optional — leave blank if the client isn't publicly named." />
        <div className="admin-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Client Name</label>
            <input value={form.clientName} onChange={set('clientName')} placeholder="Optional" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Project Year</label>
            <input value={form.projectYear} onChange={set('projectYear')} placeholder="e.g. 2026" style={inputStyle} />
          </div>
        </div>
      </div>

      {/* ═══ 4. CASE STUDY ═══ */}
      <div style={sectionStyle}>
        <SectionHeading title="Case Study" subtitle="Overview is required. Everything else is optional — omitted sections simply don't render." />

        <div>
          <label style={labelStyle}>Overview *</label>
          <textarea value={form.description} onChange={set('description')} rows={4} placeholder="What is this product/system, and what was it built to accomplish?" style={{ ...inputStyle, resize: 'vertical' }} />
        </div>
        <div>
          <label style={labelStyle}>The Challenge</label>
          <textarea value={form.challenge} onChange={set('challenge')} rows={3} placeholder="The operational/business problem that existed before this project — only if genuinely known." style={{ ...inputStyle, resize: 'vertical' }} />
        </div>
        <div>
          <label style={labelStyle}>The Solution</label>
          <textarea value={form.solution} onChange={set('solution')} rows={3} placeholder="What Zaref designed/built and how it addressed the problem." style={{ ...inputStyle, resize: 'vertical' }} />
        </div>
        <div>
          <label style={labelStyle}>Outcome / Results</label>
          <textarea value={form.outcome} onChange={set('outcome')} rows={2} placeholder="Only fill in a verified, real outcome. Never a placeholder or estimate." style={{ ...inputStyle, resize: 'vertical' }} />
        </div>
      </div>

      {/* ═══ 5. KEY FEATURES ═══ */}
      <div style={sectionStyle}>
        <SectionHeading title="Key Features" subtitle="Repeatable — optional." />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {(form.features ?? []).map((feature, idx) => (
            <div key={idx} style={{ padding: '1rem', border: '1.5px solid var(--border)', borderRadius: '0.75rem', background: 'var(--surface-2)' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <input
                  value={feature.title}
                  onChange={e => updateFeature(idx, 'title', e.target.value)}
                  placeholder="Feature title"
                  style={{ ...inputStyle, fontWeight: 700 }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0 }}>
                  <button type="button" onClick={() => moveFeature(idx, -1)} disabled={idx === 0} style={{ padding: '0.2rem', border: '1px solid var(--border)', borderRadius: '0.3rem', background: 'var(--surface)', cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.4 : 1 }}>
                    <ChevronUp size={12} />
                  </button>
                  <button type="button" onClick={() => moveFeature(idx, 1)} disabled={idx === (form.features?.length ?? 0) - 1} style={{ padding: '0.2rem', border: '1px solid var(--border)', borderRadius: '0.3rem', background: 'var(--surface)', cursor: 'pointer', opacity: idx === (form.features?.length ?? 0) - 1 ? 0.4 : 1 }}>
                    <ChevronDown size={12} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeFeature(idx)}
                  style={{ flexShrink: 0, padding: '0 0.75rem', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '0.5rem', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              </div>
              <textarea
                value={feature.description}
                onChange={e => updateFeature(idx, 'description', e.target.value)}
                rows={2}
                placeholder="Feature description"
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addFeature}
          style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1rem', border: '1.5px dashed var(--border)', borderRadius: '0.65rem', background: 'transparent', color: 'var(--foreground)', fontWeight: 600, cursor: 'pointer' }}
        >
          <Plus size={15} /> Add Feature
        </button>
      </div>

      {/* ═══ 6. ENGINEERING ═══ */}
      <div style={sectionStyle}>
        <SectionHeading title="Engineering" subtitle="Supports the case study — kept secondary to business capabilities on the public page." />
        <ChipInput label="Technologies" placeholder="e.g. React" values={form.technologies ?? []} onChange={v => setForm(prev => ({ ...prev, technologies: v }))} />
        <ChipInput label="Platforms" placeholder="e.g. iOS, Android, Web" values={form.platforms ?? []} onChange={v => setForm(prev => ({ ...prev, platforms: v }))} />
        <ChipInput label="Integrations" placeholder="e.g. Razorpay, WhatsApp API" values={form.integrations ?? []} onChange={v => setForm(prev => ({ ...prev, integrations: v }))} />
      </div>

      {/* ═══ 7. MEDIA ═══ */}
      <div style={sectionStyle}>
        <SectionHeading title="Media" subtitle="The first image is the cover, shown on cards and as the case-study hero." />

        <div>
          <label style={labelStyle}>Project Images</label>
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: '0.85rem', padding: '2rem 1rem', textAlign: 'center',
              cursor: uploading ? 'not-allowed' : 'pointer',
              background: dragOver ? 'rgba(37,99,235,0.05)' : 'var(--surface-2)',
              transition: 'all 0.2s',
            }}
          >
            <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
            {uploading ? (
              <div>
                <Loader2 size={28} color="var(--primary)" style={{ animation: 'spin 0.7s linear infinite', margin: '0 auto 0.75rem', display: 'block' }} />
                <p style={{ color: 'var(--primary)', fontWeight: 600, margin: '0 0 0.25rem', fontSize: '0.9rem' }}>
                  Uploading {uploadProgress.done} / {uploadProgress.total} images…
                </p>
                <div style={{ height: '4px', background: 'var(--border)', borderRadius: '99px', margin: '0.75rem auto 0', maxWidth: '200px' }}>
                  <div style={{ height: '100%', width: `${uploadProgress.total ? (uploadProgress.done / uploadProgress.total) * 100 : 0}%`, background: 'var(--primary)', borderRadius: '99px', transition: 'width 0.3s ease' }} />
                </div>
              </div>
            ) : (
              <>
                <ImagePlus size={28} color="var(--muted)" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
                <p style={{ color: 'var(--foreground)', fontWeight: 600, margin: '0 0 0.25rem', fontSize: '0.9rem' }}>Drop images here or click to browse</p>
                <p style={{ color: 'var(--muted)', fontSize: '0.8rem', margin: 0 }}>PNG, JPG, WebP — multiple files supported</p>
              </>
            )}
          </div>

          {form.images.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              {form.images.map((url, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.85rem', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '0.75rem', background: 'var(--surface-2)' }}>
                  <div style={{ position: 'relative', width: '84px', height: '84px', flexShrink: 0, borderRadius: '0.5rem', overflow: 'hidden' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      title="Remove image"
                      style={{ position: 'absolute', top: '3px', right: '3px', width: '20px', height: '20px', background: 'rgba(0,0,0,0.65)', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: 0 }}
                    >
                      <X size={11} />
                    </button>
                    {idx === 0 && (
                      <div style={{ position: 'absolute', bottom: '2px', left: '2px', right: '2px', textAlign: 'center', fontSize: '0.58rem', fontWeight: 700, background: 'var(--primary)', color: '#fff', borderRadius: '3px' }}>COVER</div>
                    )}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input
                      value={form.gallery?.[idx]?.alt ?? ''}
                      onChange={e => updateGalleryMeta(idx, 'alt', e.target.value)}
                      placeholder="Alt text (for accessibility)"
                      style={{ ...inputStyle, padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                    />
                    <input
                      value={form.gallery?.[idx]?.caption ?? ''}
                      onChange={e => updateGalleryMeta(idx, 'caption', e.target.value)}
                      placeholder="Caption (optional)"
                      style={{ ...inputStyle, padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              ))}
              <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.75rem', borderRadius: '0.6rem', border: '2px dashed var(--border)', cursor: 'pointer', color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 600 }}
              >
                <Upload size={14} /> Add More Images
              </div>
            </div>
          )}
        </div>

        <div>
          <label style={labelStyle}>YouTube Video URL</label>
          <input value={form.youtubeUrl} onChange={set('youtubeUrl')} placeholder="https://youtube.com/watch?v=... or youtu.be/..." style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Accent Color</label>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {PROJECT_ACCENT_COLORS.map(c => (
              <button
                key={c.value}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, color: c.value }))}
                title={c.label}
                style={{
                  width: '30px', height: '30px', borderRadius: '50%', background: c.value,
                  border: form.color === c.value ? '3px solid var(--foreground)' : '3px solid transparent',
                  cursor: 'pointer', transition: 'transform 0.15s',
                  transform: form.color === c.value ? 'scale(1.25)' : 'scale(1)', outline: 'none',
                }}
              />
            ))}
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)', marginLeft: '0.25rem' }}>
              {PROJECT_ACCENT_COLORS.find(c => c.value === form.color)?.label}
            </span>
          </div>
          <p style={helperStyle}>Used as the fallback background when no cover image is set.</p>
        </div>
      </div>

      {/* ═══ 8. PROJECT LINKS ═══ */}
      <div style={sectionStyle}>
        <SectionHeading title="Project Links" subtitle="Only links you fill in are shown publicly." />
        <div className="admin-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Live URL</label>
            <input value={form.projectUrl} onChange={set('projectUrl')} placeholder="https://..." style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>GitHub URL</label>
            <input value={form.githubUrl} onChange={set('githubUrl')} placeholder="https://github.com/... (leave blank for client projects)" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Google Play URL</label>
            <input value={form.playStoreUrl} onChange={set('playStoreUrl')} placeholder="https://play.google.com/..." style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>App Store URL</label>
            <input value={form.appStoreUrl} onChange={set('appStoreUrl')} placeholder="https://apps.apple.com/..." style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Error / Success */}
      {error && (
        <div style={{ padding: '0.75rem 1rem', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '0.65rem', color: '#ef4444', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <AlertTriangle size={15} /> {error}
        </div>
      )}
      {success && (
        <div style={{ padding: '0.75rem 1rem', background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.3)', borderRadius: '0.65rem', color: '#10b981', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <CheckCircle size={15} /> Project saved! Redirecting…
        </div>
      )}

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
