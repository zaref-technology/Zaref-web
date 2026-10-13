import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbJsonLd } from '@/lib/structured-data';
import { OWNER, BUSINESS_TYPE } from '@/constants/legal';

/** Shared typography for legal page bodies (Privacy Policy, Terms & Conditions). */
export const legal = {
  h2: 'mb-4 mt-12 scroll-mt-[calc(var(--header-height)+1.5rem)] text-xl font-extrabold text-foreground',
  p: 'mb-4 leading-[1.8] text-muted',
  ul: 'mb-4 list-disc space-y-2 pl-5 leading-[1.8] text-muted marker:text-primary',
  strong: 'font-semibold text-foreground',
  link: 'font-semibold text-primary underline-offset-4 hover:underline',
};

export type LegalSection = { id: string; label: string };

type LegalPageProps = {
  title: string;
  path: string;
  intro: string;
  lastUpdated: string;
  sections: LegalSection[];
  children: React.ReactNode;
};

/** Header + sticky "On this page" menu + article column, shared by every legal page. */
export function LegalPage({ title, path, intro, lastUpdated, sections, children }: LegalPageProps) {
  return (
    <div className="pt-[var(--header-height)]">
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: title, path }])} />

      <section className="border-b border-border bg-surface pb-16 pt-10 md:pb-20 md:pt-14">
        <Container>
          <Badge>Legal</Badge>
          <h1 className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.1] text-foreground">{title}</h1>
          <p className="mt-4 max-w-[600px] text-lg text-muted">{intro}</p>
          <p className="mt-6 text-sm text-muted">Last updated: {lastUpdated}</p>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr] lg:gap-16">
            <nav aria-label={`${title} sections`} className="lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-primary-light">On this page</h2>
              <ol className="flex flex-col gap-2.5 border-l border-border pl-4">
                {sections.map(s => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="text-sm font-medium text-muted transition-colors hover:text-primary-light">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <article className="max-w-[720px]">{children}</article>
          </div>
        </Container>
      </Section>
    </div>
  );
}

export function OwnerEmailLink() {
  return <a href={`mailto:${OWNER.email}`} className={legal.link}>{OWNER.email}</a>;
}

/** The business/owner contact card shown at the end of each legal page. */
export function OwnerContact() {
  return (
    <address className="not-italic">
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 rounded-xl border border-border bg-surface p-5 text-sm leading-[1.7]">
        <dt className="font-semibold text-foreground">Business</dt>
        <dd className="text-muted">Zaref ({BUSINESS_TYPE})</dd>
        <dt className="font-semibold text-foreground">Owner</dt>
        <dd className="text-muted">{OWNER.name}</dd>
        <dt className="font-semibold text-foreground">Email</dt>
        <dd className="break-all"><OwnerEmailLink /></dd>
        <dt className="font-semibold text-foreground">Phone</dt>
        <dd><a href={OWNER.phoneHref} className={legal.link}>{OWNER.phone}</a></dd>
      </dl>
    </address>
  );
}
