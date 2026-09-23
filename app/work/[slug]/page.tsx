import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, Globe, GitFork, Play,
} from 'lucide-react';
import { getProjectBySlug, listProjects } from '@/services/projects.service';
import { CAPABILITIES } from '@/constants/capabilities';
import { ROUTES } from '@/constants/routes';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { MediaCarousel } from './MediaCarousel';
import { getYouTubeEmbedUrl } from '@/lib/youtube';
import { DEFAULT_OG_IMAGES } from '@/constants/site';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbJsonLd, projectJsonLd } from '@/lib/structured-data';
import type { Project } from '@/types/project';

interface PageProps { params: Promise<{ slug: string }>; }

export const revalidate = 300;

/** Pre-renders every published, slugged project at build time. Drafts and any project that
 * hasn't been backfilled with a slug yet are excluded — they're never publicly indexable. */
export async function generateStaticParams() {
  const projects = await listProjects();
  return projects.filter(p => !!p.slug).map(p => ({ slug: p.slug as string }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: 'Project Not Found' };

  const title = project.title;
  const description = project.shortDescription || project.description || `${project.title} — a project by Zaref.`;
  // Real product screenshots make far better link previews than the generic branded card.
  const images = project.images && project.images.length > 0 ? [project.images[0]] : DEFAULT_OG_IMAGES;
  const path = `${ROUTES.work}/${project.slug || project.id}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, images },
    twitter: { title, description, images },
  };
}

/** capabilityIds → display titles, via the same source of truth as the Services page. */
function capabilityLabels(project: Project): string[] {
  if (!project.capabilityIds || project.capabilityIds.length === 0) return [];
  return CAPABILITIES.filter(c => project.capabilityIds!.includes(c.slug)).map(c => c.title);
}

/** New records use `technologies: string[]`; legacy records store a comma-separated `tags`
 * string. Both are supported — no data is lost, no section is silently dropped. */
function technologyList(project: Project): string[] {
  if (project.technologies && project.technologies.length > 0) return project.technologies;
  if (!project.tags) return [];
  return project.tags.split(',').map(t => t.trim()).filter(Boolean);
}

const factLabel = 'text-xs font-bold uppercase tracking-wider text-muted';

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const path = `${ROUTES.work}/${project.slug || project.id}`;
  const embedUrl = getYouTubeEmbedUrl(project.youtubeUrl ?? '');
  const capabilities = capabilityLabels(project);
  const technologies = technologyList(project);
  // `solution` is the canonical field; `approach` is its deprecated legacy name.
  const solutionText = project.solution || project.approach;
  const teaser = project.shortDescription || project.description?.split('\n')[0];
  const features = (project.features ?? []).filter(f => f.title || f.description);
  const hasStores = !!(project.appStoreUrl || project.playStoreUrl);
  const hasEngineering = technologies.length > 0 || (project.platforms?.length ?? 0) > 0 || (project.integrations?.length ?? 0) > 0;

  const facts = [
    { label: 'Client', value: project.clientName },
    { label: 'Industry', value: project.industry },
    { label: 'Product Type', value: project.category },
    { label: 'Solution Type', value: project.solutionType },
    { label: 'Platform', value: project.platforms?.join(', ') },
    { label: 'Year', value: project.projectYear },
  ].filter(f => f.value?.trim());

  return (
    <div className="pt-[var(--header-height)]">
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Work', path: ROUTES.work }, { name: project.title, path }])} />
      <JsonLd data={projectJsonLd({ path, title: project.title, description: project.description, images: project.images ?? [], category: project.category })} />

      {/* Back bar */}
      <Container className="py-4">
        <Link href={ROUTES.work} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-foreground">
          <ArrowLeft size={15} /> Back to Work
        </Link>
      </Container>

      <article>
        {/* ── Hero — business context leads; technology never appears here. Given its own
            intentional top breathing room, deliberately separated from the compact back bar. ── */}
        <div className="border-b border-border pb-10 pt-6 md:pt-10">
          <Container>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-primary">Case Study</p>
            <h1 className="mb-3 max-w-[820px] text-[clamp(2rem,4.2vw,3.25rem)] font-bold leading-[1.1] tracking-[-0.015em] text-foreground">
              {project.title}
            </h1>
            {teaser && (
              <p className="max-w-[640px] text-lg leading-[1.6] text-muted">{teaser}</p>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <span className="font-semibold text-foreground">{project.category}</span>
              {capabilities.length > 0 && (
                <span className="text-muted">{capabilities.join(' · ')}</span>
              )}
              {project.solutionType && (
                <span className="text-muted">{project.solutionType}</span>
              )}
            </div>
          </Container>
        </div>

        {/* ── Media — full width, given real presence ── */}
        <div className="py-10">
          <Container>
            <MediaCarousel
              images={project.images ?? []}
              gallery={project.gallery}
              embedUrl={embedUrl}
              color={project.color}
              title={project.title}
            />
          </Container>
        </div>

        {/* ── Overview + project facts ── */}
        {project.description && (
          <section className="border-t border-border py-12">
            <Container>
              <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_280px] md:gap-16">
                <div>
                  <h2 className="mb-4 text-[1.4rem] font-bold text-foreground">Overview</h2>
                  <p className="max-w-[680px] whitespace-pre-wrap leading-[1.8] text-muted">{project.description}</p>
                </div>
                {facts.length > 0 && (
                  <div className="flex flex-col gap-4 border-t border-border pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                    {facts.map(f => (
                      <div key={f.label}>
                        <div className={factLabel}>{f.label}</div>
                        <div className="mt-0.5 font-semibold text-foreground">{f.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Container>
          </section>
        )}

        {/* ── The Challenge ── */}
        {project.challenge && (
          <section className="border-t border-border py-12">
            <Container>
              <h2 className="mb-4 text-[1.4rem] font-bold text-foreground">The Challenge</h2>
              <p className="max-w-[680px] whitespace-pre-wrap leading-[1.8] text-muted">{project.challenge}</p>
            </Container>
          </section>
        )}

        {/* ── The Solution ── */}
        {solutionText && (
          <section className="border-t border-border py-12">
            <Container>
              <h2 className="mb-4 text-[1.4rem] font-bold text-foreground">The Solution</h2>
              <p className="max-w-[680px] whitespace-pre-wrap leading-[1.8] text-muted">{solutionText}</p>
            </Container>
          </section>
        )}

        {/* ── Key Features ── */}
        {features.length > 0 && (
          <section className="border-t border-border py-12">
            <Container>
              <h2 className="mb-8 text-[1.4rem] font-bold text-foreground">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-12">
                {features.map((f, i) => (
                  <div key={i} className="flex gap-5 border-t border-border py-6">
                    <span className="flex-shrink-0 pt-0.5 text-sm font-bold text-primary">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="mb-1.5 font-bold text-foreground">{f.title}</h3>
                      {f.description && <p className="text-sm leading-[1.7] text-muted">{f.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* ── Engineering — supports the case study, kept secondary ── */}
        {hasEngineering && (
          <section className="border-t border-border bg-surface-2 py-12">
            <Container>
              <h2 className="mb-6 text-[1.4rem] font-bold text-foreground">Engineering</h2>
              <div className="flex flex-col gap-6">
                {technologies.length > 0 && (
                  <div>
                    <div className={factLabel}>Technologies</div>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {technologies.map(t => (
                        <span key={t} className="rounded-md border border-border bg-surface px-2.5 py-1 text-[0.78rem] font-semibold text-muted">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                {(project.platforms?.length ?? 0) > 0 && (
                  <div>
                    <div className={factLabel}>Platforms</div>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {project.platforms!.map(t => (
                        <span key={t} className="rounded-md border border-border bg-surface px-2.5 py-1 text-[0.78rem] font-semibold text-muted">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                {(project.integrations?.length ?? 0) > 0 && (
                  <div>
                    <div className={factLabel}>Integrations</div>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {project.integrations!.map(t => (
                        <span key={t} className="rounded-md border border-border bg-surface px-2.5 py-1 text-[0.78rem] font-semibold text-muted">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                {embedUrl && (
                  <div>
                    <div className={factLabel}>Video Demo</div>
                    <a href={project.youtubeUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      <Play size={13} fill="currentColor" /> Watch on YouTube
                    </a>
                  </div>
                )}
              </div>
            </Container>
          </section>
        )}

        {/* ── Outcome ── */}
        {project.outcome && (
          <section className="border-t border-border py-12">
            <Container>
              <h2 className="mb-4 text-[1.4rem] font-bold text-foreground">Outcome</h2>
              <p className="max-w-[680px] whitespace-pre-wrap leading-[1.8] text-muted">{project.outcome}</p>
            </Container>
          </section>
        )}

        {/* ── Project links — only what actually exists, no empty sidebar ── */}
        {(project.projectUrl || project.githubUrl || hasStores) && (
          <section className="border-t border-border py-12">
            <Container>
              <h2 className="mb-6 text-[1.4rem] font-bold text-foreground">Project Links</h2>
              <div className="flex flex-wrap gap-3">
                {project.projectUrl && (
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <Globe size={15} /> Visit Live Product
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <GitFork size={15} /> View on GitHub
                  </a>
                )}
                {project.appStoreUrl && (
                  <a href={project.appStoreUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-85">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                    App Store
                  </a>
                )}
                {project.playStoreUrl && (
                  <a href={project.playStoreUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 rounded-lg bg-[#01875f] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-85">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76a2 2 0 0 1-1.01-1.76V2A2 2 0 0 1 3.18.24l12.56 11.76L3.18 23.76zM16.15 13.5 5.75 24l10.4-5.5 2.72-2.54L16.15 13.5zm3.7-2.14-2.7-1.41L14.5 12l2.65 2.05 2.7-1.41a1.5 1.5 0 0 0 0-2.28zM5.75 0l10.4 10.5-2.62 2.47L5.75 0z" /></svg>
                    Google Play
                  </a>
                )}
              </div>
            </Container>
          </section>
        )}

        {/* ── Final CTA ── */}
        <section className="border-t border-border bg-surface-2 py-16">
          <Container>
            <div className="mx-auto max-w-[560px] text-center">
              <h2 className="mb-3 text-[clamp(1.5rem,2.8vw,2rem)] font-bold text-foreground">
                Have a software project in mind?
              </h2>
              <p className="mb-7 leading-[1.6] text-muted">
                Tell us what you&apos;re building — we&apos;ll help you figure out the right technical approach.
              </p>
              <Button href="/contact">
                Discuss Your Project <ArrowRight size={16} />
              </Button>
            </div>
          </Container>
        </section>
      </article>
    </div>
  );
}
