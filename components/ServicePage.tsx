import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { getProjectBySlug } from '@/services/projects.service';

/** The one delivered project both dedicated service pages point to as proof. */
const VR_CRM_SLUG = 'vr-crm-solar-business-crm-software';

/** The published VR CRM project, or null — callers omit their proof block entirely when null. */
export function getVrCrmProject() {
  return getProjectBySlug(VR_CRM_SLUG);
}

/** Shared section heading scale — same as the homepage/Services section headings. */
export const serviceH2 = 'text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.01em] text-foreground';

/** Vertical padding for the plain editorial sections on the service pages — a little tighter
 * than the default `py-20` so consecutive sections don't stack into large gaps. */
export const serviceSectionY = 'py-14 md:py-[4.25rem]';

export function ServiceBackBar() {
  return (
    <Container className="py-4">
      <Link href={ROUTES.services} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-foreground">
        <ArrowLeft size={15} /> Back to Services
      </Link>
    </Container>
  );
}

/** Same brand treatment as the /services hero (subtle technical grid, eyebrow, headline scale),
 * without the homepage's engineering diagram. */
export function ServiceHero({ badge, title, intro, children }: {
  badge: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_1px_1px,color-mix(in_srgb,var(--foreground)_6%,transparent)_1px,transparent_0)] [background-size:48px_48px]" />
      <Container>
        <div className="relative z-[1] max-w-[800px] pb-14 pt-6 md:pb-[4.5rem] md:pt-10">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">{badge}</p>
          <h1 className="mb-6 text-[clamp(2.25rem,4.2vw,3.25rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-foreground">{title}</h1>
          <p className="mb-9 max-w-[640px] text-[clamp(1rem,1.6vw,1.15rem)] leading-[1.7] text-muted">{intro}</p>
          <div className="flex flex-wrap items-center gap-5">{children}</div>
        </div>
      </Container>
    </section>
  );
}

/** Editorial rows in a responsive column grid. Five items lay out as 3 + 2 (the last two wider)
 * rather than leaving a lone orphan cell. */
export function ServiceRows({ heading, lead, items }: {
  heading: string;
  lead?: string;
  items: { title: string; text?: string }[];
}) {
  const fiveUp = items.length === 5;
  return (
    <Section padded={false} className={serviceSectionY}>
      <Container>
        <div className="mb-9 max-w-[600px]">
          <h2 className={serviceH2}>{heading}</h2>
          {lead && <p className="mt-4 leading-[1.7] text-muted">{lead}</p>}
        </div>
        <div className={`grid grid-cols-1 gap-8 md:gap-x-10 md:gap-y-9 ${fiveUp ? 'md:grid-cols-6' : 'md:grid-cols-3'}`}>
          {items.map((item, i) => (
            <div
              key={item.title}
              className={`border-t border-border pt-6 ${fiveUp ? (i < 3 ? 'md:col-span-2' : 'md:col-span-3') : ''}`}
            >
              <h3 className="mb-2.5 text-[1.05rem] font-bold text-foreground">{item.title}</h3>
              {item.text && <p className="max-w-[440px] text-sm leading-[1.7] text-muted">{item.text}</p>}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/** Numbered process. Wide screens: one balanced column per step (5 columns from `xl`, 4 from `lg`).
 * Below that: editorial rows (number | title | text) — never a 4 + 1 wrap. Mobile stacks. */
export function ServiceSteps({ heading, steps }: { heading: string; steps: { title: string; text: string }[] }) {
  const five = steps.length >= 5;
  const listCols = five ? 'xl:grid-cols-5' : 'lg:grid-cols-4';
  const itemCols = five ? 'xl:block xl:pb-0 xl:pt-6' : 'lg:block lg:pb-0 lg:pt-6';
  const inner = five ? 'xl:mb-3 xl:block' : 'lg:mb-3 lg:block';
  return (
    <Section padded={false} className={`${serviceSectionY} border-y border-border bg-surface-2`}>
      <Container>
        <h2 className={`${serviceH2} mb-9 max-w-[600px]`}>{heading}</h2>
        <ol className={`m-0 grid list-none grid-cols-1 gap-0 p-0 xl:gap-x-8 ${listCols}`}>
          {steps.map((step, i) => (
            <li
              key={step.title}
              className={`border-t border-border py-5 md:grid md:grid-cols-[3rem_minmax(0,17rem)_minmax(0,1fr)] md:items-baseline md:gap-x-6 ${itemCols}`}
            >
              <span className={`mb-1.5 block font-mono text-sm font-semibold tracking-[0.08em] text-primary/70 md:mb-0 ${inner}`}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mb-1.5 text-[1.05rem] font-bold text-foreground md:mb-0 xl:mb-2.5">{step.title}</h3>
              <p className="text-sm leading-[1.7] text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

/** Deliberately dark, hardcoded colors — same closing CTA treatment as the other pages. */
export function ServiceCta({ title, text, relatedHref, relatedLabel }: {
  title: string;
  text: string;
  relatedHref: string;
  relatedLabel: string;
}) {
  return (
    <section className="bg-[#0b1018] py-20 md:py-24">
      <Container>
        <div className="mx-auto max-w-[600px] text-center">
          <h2 className="mb-4 text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.01em] text-white">{title}</h2>
          <p className="mx-auto mb-8 text-[1.05rem] leading-[1.6] text-white/60">{text}</p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <Button href={ROUTES.contact}>
              Discuss Your Project <ArrowRight size={16} />
            </Button>
            <Link href={relatedHref} className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 transition-colors hover:text-white">
              {relatedLabel} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
