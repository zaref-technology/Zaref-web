import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbJsonLd } from '@/lib/structured-data';
import { DEFAULT_OG_IMAGES } from '@/constants/site';
import { ROUTES } from '@/constants/routes';

const title = 'Company';
const description = 'Zaref is a software development company building custom software, web applications, mobile apps and business systems for companies, startups and organizations.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/company' },
  openGraph: { title, description, url: '/company', images: DEFAULT_OG_IMAGES },
  twitter: { title, description, images: DEFAULT_OG_IMAGES },
};

const capabilities = [
  'Custom Software',
  'Web Applications',
  'Mobile Development',
  'Business Systems',
  'AI & Automation',
  'APIs & Integrations',
];

const snapshot = [
  'A focused, senior software engineering team',
  'Software, web and mobile development',
  'India-based, working with businesses globally',
];

const principles = [
  { title: 'Understand before building', desc: 'We learn how the business actually works before writing a line of code.' },
  { title: 'Design around the user', desc: 'Every screen and workflow is built around the person who has to use it daily.' },
  { title: 'Engineer for maintainability', desc: 'Code that a future team can read, change and extend with confidence.' },
];

export default function Company() {
  return (
    <div className="pt-[var(--header-height)]">
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Company', path: '/company' }])} />
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border bg-surface pb-16 pt-10 md:pb-20 md:pt-14">
        <Container>
          <div className="relative z-[1]">
            <Badge>Company</Badge>
            <h1 className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.1] text-foreground">
              We build technology around<br />how businesses actually work.
            </h1>
            <p className="mt-4 max-w-[600px] text-lg text-muted">
              Zaref is a software development company building custom digital products and business systems for companies, startups and organizations.
            </p>
          </div>
        </Container>
      </section>

      {/* Bio + Company snapshot */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
            <Card hover={false} className="max-w-[420px] p-10">
              <h3 className="mb-5 text-xs font-bold uppercase tracking-wider text-primary-light">At a Glance</h3>
              <ul className="m-0 flex flex-col gap-4 p-0">
                {snapshot.map(item => (
                  <li key={item} className="list-none text-[0.95rem] font-medium leading-[1.6] text-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            <div>
              <h2 className="mb-4 text-2xl font-extrabold text-foreground">What we do</h2>
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
          </div>
        </Container>
      </Section>

      {/* Capabilities */}
      <Section className="border-t border-border bg-surface">
        <Container>
          <div className="mb-12 text-center">
            <Badge className="mx-auto">What We Work With</Badge>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.1] text-foreground">Capabilities</h2>
          </div>
          <div className="mx-auto flex max-w-[760px] flex-wrap justify-center gap-3">
            {capabilities.map(cap => (
              <span
                key={cap}
                className="rounded-full border-[1.5px] border-border bg-surface-2 px-5 py-2.5 text-sm font-semibold text-foreground"
              >
                {cap}
              </span>
            ))}
          </div>
        </Container>
      </Section>

      {/* Principles */}
      <Section>
        <Container>
          <div className="mb-12 text-center">
            <Badge className="mx-auto">How We Work</Badge>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.1] text-foreground">Our Principles</h2>
          </div>
          <div className="mx-auto grid max-w-[900px] grid-cols-1 gap-6 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
            {principles.map(p => (
              <Card key={p.title}>
                <h3 className="mb-2 text-[1.05rem] font-bold text-foreground">{p.title}</h3>
                <p className="text-sm leading-[1.7] text-muted">{p.desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
