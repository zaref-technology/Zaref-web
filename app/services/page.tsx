import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { DEFAULT_OG_IMAGES } from '@/constants/site';
import { CAPABILITIES } from '@/constants/capabilities';
import { BUSINESS_SOLUTIONS } from '@/constants/solutions';
import { ROUTES, getProjectUrl } from '@/constants/routes';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import ProjectsSection from '@/components/ProjectsSection';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbJsonLd, servicesJsonLd } from '@/lib/structured-data';
import { listProjects } from '@/services/projects.service';

/* Shared anchor scroll-margin — only the small intentional buffer; the header height itself is
 * now supplied globally by `html { scroll-padding-top }`, so adding it here would double it. */
const anchorScrollMt = 'scroll-mt-4';

const title = 'Software Development Services';
const description = "Explore Zaref's custom software development, web application, mobile app, business systems, AI automation and integration services for businesses and organizations.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/services' },
  openGraph: { title, description, url: '/services', images: DEFAULT_OG_IMAGES },
  twitter: { title, description, images: DEFAULT_OG_IMAGES },
};

export const revalidate = 300;

const engagementModels = [
  {
    title: 'Build a Complete Solution',
    description: 'For businesses and startups that need Zaref to design and develop a software product or system from requirements through delivery.',
  },
  {
    title: 'Extend Your Team',
    description: 'For product companies and agencies that need additional engineering capacity to move faster on their own roadmap.',
  },
  {
    title: 'Ongoing Development',
    description: 'For existing software that needs new features, integrations, improvements and continued maintenance.',
  },
];

export default async function ServicesPage() {
  // Real Work evidence per capability comes only from each published project's own capabilityIds —
  // nothing is inferred, and a capability with no such project shows nothing.
  const projects = (await listProjects()).filter(p => !!p.slug);

  return (
    <div className="pt-[var(--header-height)]">
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }])} />
      <JsonLd data={servicesJsonLd(CAPABILITIES)} />

      {/* Hero — its own purpose, same restrained visual language as the homepage hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_1px_1px,color-mix(in_srgb,var(--foreground)_6%,transparent)_1px,transparent_0)] [background-size:48px_48px]" />
        <Container>
          <div className="relative z-[1] max-w-[720px] pb-16 pt-10 md:pb-20 md:pt-14">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Our Services
            </p>
            <h1 className="mb-6 text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.15] tracking-[-0.02em] text-foreground">
              Software engineering <span className="text-primary">for real business needs.</span>
            </h1>
            <p className="mb-9 max-w-[600px] text-[clamp(1rem,1.6vw,1.15rem)] leading-[1.7] text-muted">
              From custom business systems and digital products to mobile applications, integrations and automation, Zaref designs and develops software around the way businesses actually operate.
            </p>
            <div className="flex flex-wrap items-center gap-5">
              <Button href={ROUTES.contact}>
                Discuss Your Project <ArrowRight size={16} />
              </Button>
              <Button href={ROUTES.work} variant="ghost">
                View Our Work <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Core capabilities overview — a compact index, deliberately NOT styled like a nav bar
          (no full-width fill/border band) so it never reads as a second header under the real one */}
      <section className="py-6">
        <Container>
          <nav aria-label="Core capabilities" className="flex flex-wrap gap-x-10 gap-y-3">
            {CAPABILITIES.map(cap => (
              <a
                key={cap.slug}
                href={`#${cap.slug}`}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-muted transition-colors hover:text-primary"
              >
                <span className="text-primary/70">{cap.n}</span> {cap.title}
              </a>
            ))}
          </nav>
        </Container>
      </section>

      {/* Detailed capability sections — same six categories as the homepage, alternating layout */}
      <Section>
        <Container>
          <div className="flex flex-col gap-20 md:gap-24">
            {CAPABILITIES.map((cap, i) => {
              const Icon = cap.icon;
              const reversed = i % 2 === 1;
              return (
                <div
                  key={cap.slug}
                  id={cap.slug}
                  className={`${anchorScrollMt} border-t border-border pt-14 first:border-t-0 first:pt-0 md:pt-16`}
                >
                  <div className={`relative grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20 ${reversed ? 'md:[&>*:first-child]:order-2' : ''}`}>
                    {/* Center divider — a fixed overlay so it always sits between the columns,
                        regardless of which side is visually reversed */}
                    <div className="pointer-events-none absolute inset-y-1 left-1/2 hidden w-px -translate-x-1/2 bg-border md:block" />

                    <div>
                      <div className="mb-6 flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-surface-2">
                          <Icon size={22} className="text-primary" />
                        </div>
                        <span className="font-mono text-sm font-semibold tracking-[0.08em] text-primary/70">{cap.n}</span>
                      </div>
                      <h2 className="mb-4 text-[clamp(1.5rem,2.6vw,2rem)] font-bold leading-[1.2] tracking-[-0.015em] text-foreground">
                        {cap.title}
                      </h2>
                      <p className="max-w-[480px] leading-[1.75] text-muted">{cap.longDescription}</p>

                      {(() => {
                        const related = projects.filter(p => p.capabilityIds?.includes(cap.slug));
                        if (related.length === 0) return null;
                        return (
                          <p className="mt-5 max-w-[480px] text-sm leading-[1.7] text-muted">
                            Related work:{' '}
                            {related.map((p, idx) => (
                              <span key={p.id}>
                                {idx > 0 && ', '}
                                <Link href={getProjectUrl(p)} className="font-semibold text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline">{p.title}</Link>
                              </span>
                            ))}
                          </p>
                        );
                      })()}

                      {cap.pagePath && (
                        <p className="mt-5">
                          <Link href={cap.pagePath} className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-primary">
                            Explore {cap.title} <ArrowRight size={14} />
                          </Link>
                        </p>
                      )}

                      {cap.slug === 'web-applications' && (
                        <p className="mt-5 max-w-[480px] border-l-2 border-border pl-4 text-sm leading-[1.7] text-muted">
                          This also covers <strong className="font-semibold text-foreground">websites &amp; digital commerce</strong> — corporate websites, business websites and commerce experiences — when they&apos;re part of a broader platform. It isn&apos;t Zaref&apos;s primary identity, but it is something we build.
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-foreground/70 md:mt-1">Includes</p>
                      <ul className="m-0 grid grid-cols-1 gap-x-8 gap-y-4 p-0 sm:grid-cols-2">
                        {cap.useCases.map(useCase => (
                          <li key={useCase} className="flex list-none items-start gap-2.5 text-[0.925rem] font-medium leading-[1.4] text-foreground">
                            <Check size={16} className="mt-0.5 flex-shrink-0 text-primary" />
                            {useCase}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Business Solutions — problem-first entry point, same data as the homepage's Business Software
          section. Canonical target for the Navbar's "Solutions" link (/services#solutions). */}
      <Section id="solutions" className={`${anchorScrollMt} border-y border-border bg-surface-2`}>
        <Container>
          <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
            <div>
              <Badge>Built Around Your Business</Badge>
              <h2 className="text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.01em] text-foreground">
                Technology shaped around
                <br />
                your operations.
              </h2>
              <p className="mt-4 max-w-[460px] leading-[1.7] text-muted">
                The six capabilities above are how we engineer. This is what businesses actually use them to build.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
              {BUSINESS_SOLUTIONS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className={`flex items-center gap-3 border-t border-border py-4 ${i >= BUSINESS_SOLUTIONS.length - 2 ? 'sm:border-b' : ''}`}
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-border bg-surface">
                      <Icon size={16} className="text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>

      {/* Engagement models — how clients can work with Zaref, no fake pricing/SLAs */}
      <Section>
        <Container>
          <div className="mb-12 max-w-[600px]">
            <Badge>How We Work</Badge>
            <h2 className="text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.01em] text-foreground">
              Flexible ways to work with us.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
            {engagementModels.map((model, i) => (
              <div key={model.title} className="border-t border-border pt-6">
                <span className="mb-3 block font-mono text-sm font-semibold tracking-[0.08em] text-primary/70">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mb-2.5 text-[1.05rem] font-bold text-foreground">{model.title}</h3>
                <p className="text-sm leading-[1.7] text-muted">{model.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Relevant work — reuses the same "Selected Work" component as the homepage, compact presentation */}
      <ProjectsSection variant="compact" />

      {/* Final CTA — deliberately dark, matching the homepage's one strategic dark treatment */}
      <section className="bg-[#0b1018] py-20 md:py-24">
        <Container>
          <div className="mx-auto max-w-[600px] text-center">
            <h2 className="mb-4 text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.01em] text-white">
              Ready to build your next system?
            </h2>
            <p className="mx-auto mb-8 text-[1.05rem] leading-[1.6] text-white/60">
              Tell us about your business requirements and we&apos;ll help you figure out the right approach — whichever of these capabilities it touches.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href={ROUTES.contact}>
                Discuss Your Project <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
