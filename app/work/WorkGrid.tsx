'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, FolderKanban } from 'lucide-react';
import { cn } from '@/lib/cn';
import { getProjectUrl } from '@/constants/routes';
import { CAPABILITIES } from '@/constants/capabilities';
import type { Project } from '@/types/project';

/** capabilityIds → display titles, via the same source of truth as Services/homepage. Never
 * inferred from free text — only capabilities the admin explicitly selected are shown. */
function capabilityLabels(ids: string[] | undefined): string[] {
  if (!ids || ids.length === 0) return [];
  return CAPABILITIES.filter(c => ids.includes(c.slug)).map(c => c.title);
}

/** Primary classification shown on each project: the real `solutionType` (e.g. "CRM") where
 * it exists, falling back to the legacy `category` field only when no solutionType has been
 * set — never a display-only invented value. */
function classification(project: Project): string {
  return project.solutionType || project.category || 'Project';
}

/** Neutral fallback for a project with no cover image yet — no per-project arbitrary color,
 * matching the site's restrained single-accent visual language. */
function ImageFallback({ project, size }: { project: Project; size: 'lg' | 'sm' }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl border border-border bg-surface-2 font-bold text-primary',
        size === 'lg' ? 'h-16 w-16 text-2xl' : 'h-14 w-14 text-xl'
      )}
    >
      {project.category?.charAt(0) ?? 'P'}
    </div>
  );
}

/* ── Featured project — larger editorial image + content split ─── */
function FeaturedProject({ project: proj }: { project: Project }) {
  const capabilities = capabilityLabels(proj.capabilityIds);
  const firstImg = proj.images && proj.images.length > 0 ? proj.images[0] : null;
  const teaser = proj.shortDescription || proj.description;
  const href = getProjectUrl(proj);

  return (
    <div className="mb-14 grid grid-cols-1 gap-8 border-b border-border pb-14 lg:grid-cols-2 lg:gap-12">
      <Link
        href={href}
        aria-label={`View case study: ${proj.title}`}
        className="group/image relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-xl border border-border lg:order-2"
        style={{ background: firstImg ? 'var(--surface)' : 'var(--surface-2)' }}
      >
        {firstImg ? (
          <Image
            src={firstImg}
            alt={`${proj.title} — project screenshot`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            className="object-cover transition-transform duration-300 group-hover/image:scale-[1.02]"
          />
        ) : (
          <ImageFallback project={proj} size="lg" />
        )}
      </Link>

      <div className="flex flex-col justify-center lg:order-1">
        <span className="mb-2.5 text-xs font-bold uppercase tracking-[0.12em] text-primary">
          {classification(proj)}
        </span>
        <h2 className="mb-3 text-[1.75rem] font-bold leading-[1.2] text-foreground">{proj.title}</h2>
        {teaser && (
          <p className="mb-4 max-w-[480px] leading-[1.65] text-muted">{teaser}</p>
        )}
        {capabilities.length > 0 && (
          <p className="mb-5 text-xs font-medium text-muted">{capabilities.join('  ·  ')}</p>
        )}
        <Link
          href={href}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-primary"
        >
          View Case Study <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

/* ── Compact grid card ─────────────────────────────────────────── */
function ProjectCard({ project: proj }: { project: Project }) {
  const capabilities = capabilityLabels(proj.capabilityIds);
  const firstImg = proj.images && proj.images.length > 0 ? proj.images[0] : null;
  const teaser = proj.shortDescription || proj.description;
  const href = getProjectUrl(proj);

  return (
    <article>
      {/* Image — only the image itself is the hover/click target; the card is never one giant
          nested-interactive surface, only two explicit links (image + "View Case Study"). */}
      <Link
        href={href}
        aria-label={`View case study: ${proj.title}`}
        className="group/image relative mb-4 flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-xl border border-border"
        style={{ background: firstImg ? 'var(--surface)' : 'var(--surface-2)' }}
      >
        {firstImg ? (
          <Image
            src={firstImg}
            alt={`${proj.title} — project screenshot`}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover/image:scale-[1.02]"
          />
        ) : (
          <ImageFallback project={proj} size="sm" />
        )}
      </Link>

      <div>
        <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-primary">
          {classification(proj)}
        </span>
        <h3 className="mb-2 text-lg font-bold leading-[1.25] text-foreground">{proj.title}</h3>
        {teaser && (
          <p className="mb-3 line-clamp-2 text-sm leading-[1.6] text-muted">{teaser}</p>
        )}
        {capabilities.length > 0 && (
          <p className="mb-3 text-xs font-medium text-muted">{capabilities.join('  ·  ')}</p>
        )}
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-primary"
        >
          View Case Study <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}

/* ── Filterable listing — receives projects fetched server-side, already ordered
   featured-first-by-displayOrder then createdAt-desc by the project service ─── */
export default function WorkGrid({ projects }: { projects: Project[] }) {
  const [activeCapability, setActiveCapability] = useState<string | null>(null); // null = "All"

  // Filter options are the approved capability architecture, restricted to only the
  // capabilities at least one currently published project actually demonstrates — never all
  // six blindly. Order follows CAPABILITIES' own declared order, not discovery order.
  const presentCapabilityIds = new Set(projects.flatMap(p => p.capabilityIds ?? []));
  const availableCapabilities = CAPABILITIES.filter(c => presentCapabilityIds.has(c.slug));

  // A project may legitimately have multiple capabilities and appear under more than one
  // filter — matched by inclusion, not equality. Only one featured slot, and only when a
  // project is explicitly marked `featured: true` in Firestore — never invented, never
  // assumed. Excluded from the filtered result below if it doesn't match the active
  // capability filter, rather than force-included.
  const featuredCandidate = projects.find(p => p.featured);
  const featured =
    featuredCandidate && (activeCapability === null || featuredCandidate.capabilityIds?.includes(activeCapability))
      ? featuredCandidate
      : null;

  const rest = projects.filter(p => p.id !== featured?.id);
  const filteredRest = activeCapability === null ? rest : rest.filter(p => p.capabilityIds?.includes(activeCapability));

  const totalVisible = (featured ? 1 : 0) + filteredRest.length;

  return (
    <>
      {/* Filters — left-aligned, compact, visually secondary to the page heading. Only shown
          when there's more than one real capability to filter by. */}
      {availableCapabilities.length > 1 && (
        <nav aria-label="Filter projects by capability" className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-border pb-6">
          <button
            type="button"
            onClick={() => setActiveCapability(null)}
            aria-pressed={activeCapability === null}
            className={cn(
              'border-b-2 pb-1 text-sm font-semibold transition-colors',
              activeCapability === null ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-foreground'
            )}
          >
            All
          </button>
          {availableCapabilities.map(cap => (
            <button
              key={cap.slug}
              type="button"
              onClick={() => setActiveCapability(cap.slug)}
              aria-pressed={activeCapability === cap.slug}
              className={cn(
                'border-b-2 pb-1 text-sm font-semibold transition-colors',
                activeCapability === cap.slug ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-foreground'
              )}
            >
              {cap.title}
            </button>
          ))}
        </nav>
      )}

      {totalVisible === 0 ? (
        <div className="py-20 text-center text-muted">
          <FolderKanban size={36} className="mx-auto mb-3 opacity-30" />
          <p>{projects.length === 0 ? 'No projects published yet — check back soon.' : 'No projects match this capability yet.'}</p>
        </div>
      ) : (
        <>
          {featured && <FeaturedProject project={featured} />}

          {filteredRest.length > 0 && (
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 pb-20 sm:grid-cols-2">
              {filteredRest.map(proj => (
                <ProjectCard key={proj.id} project={proj} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
