import Link from 'next/link';
import Image from 'next/image';
import { FolderKanban, ArrowRight } from 'lucide-react';
import { listProjects } from '@/services/projects.service';
import { CAPABILITIES } from '@/constants/capabilities';
import { ROUTES, getProjectUrl } from '@/constants/routes';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import type { Project } from '@/types/project';

/** capabilityIds → display titles, via the same source of truth as the Services page. Never
 * inferred from free text — only capabilities the admin explicitly selected are shown. */
function capabilityLabels(ids: string[] | undefined): string[] {
  if (!ids || ids.length === 0) return [];
  return CAPABILITIES.filter(c => ids.includes(c.slug)).map(c => c.title);
}

type Variant = 'featured' | 'compact';

interface ProjectsSectionProps {
  /** "featured" — large editorial presentation for the homepage (the default).
   *  "compact" — smaller, tighter presentation for reuse on secondary pages like Services. */
  variant?: Variant;
  limit?: number;
}

const DEFAULT_LIMIT: Record<Variant, number> = { featured: 3, compact: 2 };

export default async function ProjectsSection({ variant = 'featured', limit }: ProjectsSectionProps) {
  const projects = await listProjects({ limit: limit ?? DEFAULT_LIMIT[variant] });
  const isFeatured = variant === 'featured';

  return (
    <Section className="border-y border-border bg-surface-2">
      <Container>
        {/* Section header */}
        <div className={`flex flex-wrap items-end justify-between gap-4 ${isFeatured ? 'mb-14' : 'mb-10'}`}>
          <div>
            <Badge>Selected Work</Badge>
            <h2 className="text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.01em] text-foreground">Selected work.</h2>
            <p className="mt-3 max-w-[480px] text-[1.05rem] leading-[1.6] text-muted">
              A selection of software, platforms and business systems we&apos;ve built for companies and organizations.
            </p>
          </div>
          <Link
            href={ROUTES.work}
            className="inline-flex flex-shrink-0 items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-primary"
          >
            Explore Our Work <ArrowRight size={14} />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="py-12 text-center text-muted">
            <FolderKanban size={36} className="mx-auto mb-3 opacity-30" />
            <p>No projects showcased yet — add projects in the admin panel.</p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 ${isFeatured ? 'gap-x-10 gap-y-14 md:gap-x-12' : 'gap-x-8 gap-y-10'}`}>
            {projects.map(proj => (
              <ProjectCard key={proj.id} project={proj} featured={isFeatured} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}

function ProjectCard({ project: proj, featured }: { project: Project; featured: boolean }) {
  const accentColor = proj.color || '#6366f1';
  const firstImg = proj.images && proj.images.length > 0 ? proj.images[0] : null;
  const capabilities = capabilityLabels(proj.capabilityIds);
  const teaser = proj.shortDescription || proj.description;
  const href = getProjectUrl(proj);

  return (
    <article>
      {/* Image — only the image itself is the hover/click target; it zooms on its own hover,
          the rest of the card doesn't react. */}
      <Link
        href={href}
        aria-label={`View case study: ${proj.title}`}
        className={`group/image relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-border ${featured ? 'mb-6 aspect-[16/10]' : 'mb-4 aspect-[16/10]'}`}
        style={{
          background: firstImg ? 'var(--surface)' : `linear-gradient(135deg, ${accentColor}18, ${accentColor}38)`,
        }}
      >
        {firstImg ? (
          <Image
            src={firstImg}
            alt={`${proj.title} — project screenshot`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover/image:scale-[1.02]"
          />
        ) : (
          <div
            className="flex h-16 w-16 items-center justify-center rounded-xl border text-2xl font-bold"
            style={{ background: `${accentColor}28`, borderColor: `${accentColor}55`, color: accentColor }}
          >
            {proj.category?.charAt(0) ?? 'P'}
          </div>
        )}
      </Link>

      {/* Content — plain text, no navigation except the explicit CTA below */}
      <div>
        <span className="mb-2.5 block text-xs font-bold uppercase tracking-[0.12em] text-primary">
          {proj.category || 'Project'}
        </span>

        <h3 className={`mb-3 font-bold leading-[1.25] text-foreground ${featured ? 'text-[1.4rem]' : 'text-lg'}`}>
          {proj.title}
        </h3>

        {teaser && (
          <p className={`mb-4 text-muted ${featured ? 'line-clamp-2 max-w-[440px] text-[0.95rem] leading-[1.65]' : 'line-clamp-2 text-sm leading-[1.6]'}`}>
            {teaser}
          </p>
        )}

        {capabilities.length > 0 && (
          <p className="mb-4 text-xs font-medium text-muted">
            {capabilities.join('  ·  ')}
          </p>
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
