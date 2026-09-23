import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbJsonLd } from '@/lib/structured-data';
import { DEFAULT_OG_IMAGES } from '@/constants/site';
import { ROUTES } from '@/constants/routes';
import { CAPABILITIES } from '@/constants/capabilities';

const title = 'Company';
const description = 'Zaref is a software development company working with businesses, startups and organizations — turning real operational problems into custom software, platforms and business systems.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/company' },
  openGraph: { title, description, url: '/company', images: DEFAULT_OG_IMAGES },
  twitter: { title, description, images: DEFAULT_OG_IMAGES },
};

const snapshot = [
  { n: '01', label: 'Focused Engineering', text: 'A focused software engineering team' },
  { n: '02', label: 'What We Build', text: 'Custom software, platforms and business systems' },
  { n: '03', label: 'End-to-End Delivery', text: 'From product development to ongoing improvement' },
];

// Salvaged from the homepage's former AboutSection (now removed to eliminate duplication) —
// real, already-approved copy, deliberately distinct wording from ApproachSection's homepage
// principles so Home and Company no longer say the same thing twice.
const principles = [
  { n: '01', title: 'Business-first thinking', desc: 'We begin by understanding the operation, users and problem before deciding what technology should be built.' },
  { n: '02', title: 'End-to-end engineering', desc: 'From product planning and interface development to APIs, deployment and integrations, we support the complete development lifecycle.' },
  { n: '03', title: 'Built for the long term', desc: 'We build maintainable systems that can evolve as requirements, users and businesses grow.' },
];

export default function Company() {
  return (
    <div className="pt-[var(--header-height)]">
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Company', path: '/company' }])} />
      {/* Header — distinct from Home/Services/Work: a philosophy statement, not another
          "we build X for real business" line */}
      <section className="relative overflow-hidden border-b border-border bg-surface pb-16 pt-10 md:pb-20 md:pt-14">
        <Container>
          <div className="relative z-[1]">
            <Badge>Company</Badge>
            <h1 className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.1] text-foreground">
              We start with the problem, not the technology.
            </h1>
            <p className="mt-4 max-w-[600px] text-lg text-muted">
              Zaref is a software development company working with businesses, startups and organizations — turning real operational problems into custom software, platforms and business systems.
            </p>
          </div>
        </Container>
      </section>

      {/* At a Glance — full-width editorial snapshot, not an isolated card */}
      <Section>
        <Container>
          <h2 className="mb-8 text-xs font-bold uppercase tracking-wider text-primary-light">At a Glance</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-10">
            {snapshot.map(item => (
              <div key={item.n} className="border-t border-border pt-6">
                <span className="mb-2.5 block text-sm font-bold text-primary">{item.n}</span>
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">{item.label}</span>
                <p className="text-[0.95rem] font-medium leading-[1.6] text-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* What we do */}
      <Section className="border-t border-border">
        <Container>
          <div className="max-w-[720px]">
            <h2 className="mb-4 text-2xl font-extrabold text-foreground">Engineering from problem to production.</h2>
            <p className="mb-4 leading-[1.8] text-muted">
              Our team works across software engineering, mobile development, web platforms, integrations and automation — taking projects from initial requirements through development, deployment and ongoing improvement.
            </p>
            <p className="mb-8 leading-[1.8] text-muted">
              Whether it&apos;s a customer-facing product or software that runs behind the business, we focus on building systems that are practical, scalable and maintainable.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href={ROUTES.work}>View Our Work</Button>
              <Button href={ROUTES.contact} variant="outline">Discuss Your Project</Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Capabilities — a brief structured reference, not a duplicate of the Services page.
          Sourced from the same CAPABILITIES constant Services/Home use, never a separately
          hardcoded list. */}
      <Section className="border-t border-border bg-surface">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-xl font-extrabold text-foreground">Capabilities</h2>
            <Link
              href={ROUTES.services}
              className="inline-flex flex-shrink-0 items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              Explore Services <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map(c => (
              <div key={c.slug} className="flex items-baseline gap-3 border-t border-border pt-4">
                <span className="text-sm font-bold text-primary">{c.n}</span>
                <span className="text-[0.95rem] font-medium text-foreground">{c.title}</span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Principles — the deeper philosophy lives here, not on the homepage */}
      <Section className="border-t border-border">
        <Container>
          <div className="mb-12 max-w-[600px]">
            <Badge>How We Work</Badge>
            <h2 className="text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.01em] text-foreground">
              How we approach software.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-10">
            {principles.map(p => (
              <div key={p.n} className="border-t border-border pt-6">
                <span className="mb-2.5 block text-sm font-bold text-primary">{p.n}</span>
                <h3 className="mb-2 text-[1.05rem] font-bold text-foreground">{p.title}</h3>
                <p className="text-sm leading-[1.7] text-muted">{p.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Closing CTA — same restrained dark treatment used on Home/Services/Work, giving
          Company its own honest, trust-oriented framing rather than a competing CTA system */}
      <section className="bg-[#0b1018] py-20 md:py-24">
        <Container>
          <div className="mx-auto max-w-[600px] text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-[#7ba8f5]">Start a Project</p>
            <h2 className="mb-4 text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.01em] text-white">
              Build with a team that starts with the problem.
            </h2>
            <p className="mx-auto mb-8 text-[1.05rem] leading-[1.6] text-white/60">
              Tell us what you&apos;re looking to build or improve, and we&apos;ll discuss the right approach.
            </p>
            <Button href={ROUTES.contact}>
              Discuss Your Project <ArrowRight size={16} />
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
