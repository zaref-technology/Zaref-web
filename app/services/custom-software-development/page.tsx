import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { JsonLd } from '@/components/JsonLd';
import { ServiceBackBar, ServiceCta, ServiceHero, ServiceRows, ServiceSteps, getVrCrmProject, serviceH2, serviceSectionY } from '@/components/ServicePage';
import { CAPABILITIES } from '@/constants/capabilities';
import { DEFAULT_OG_IMAGES } from '@/constants/site';
import { ROUTES, getProjectUrl } from '@/constants/routes';
import { breadcrumbJsonLd, serviceJsonLd } from '@/lib/structured-data';

const capability = CAPABILITIES.find(c => c.slug === 'custom-software')!;
const path = capability.pagePath!;

const title = 'Custom Software Development for Businesses';
const description = 'Custom software built around your workflow — internal apps, CRM and workflow systems, portals, dashboards and integrations. See delivered work from Zaref.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, images: DEFAULT_OG_IMAGES },
  twitter: { title, description, images: DEFAULT_OG_IMAGES },
};

export const revalidate = 300;

const whenItems = [
  { title: 'A workflow no off-the-shelf tool fits', text: 'Your process is specific to your business, and generic software means spreadsheets, re-entry and workarounds.' },
  { title: 'Systems that need to work together', text: 'Your data sits in separate tools and people move it between them by hand.' },
  { title: 'An operational requirement, not just a website', text: 'You need software that runs part of the business: customers, orders, jobs, approvals or reporting.' },
];

const examples = [
  { title: 'Internal business applications', text: 'Tools for your own team: requests, approvals, records and administration.' },
  { title: 'CRM & workflow systems', text: 'Track leads, customers and follow-ups through your own process.' },
  { title: 'Customer & partner portals', text: 'Secure logins where clients or partners see status, documents or orders.' },
  { title: 'Operational dashboards', text: 'One view of the numbers that run the business, drawn from your own data.' },
  { title: 'API-connected applications', text: 'Software that exchanges data with the payment, messaging and business systems you already use.' },
];

const steps = [
  { title: 'Understand the workflow', text: 'We start with how the work happens today, who does it and where it breaks down.' },
  { title: 'Define the smallest useful first release', text: 'We agree the core that delivers value first, so everything else builds on something real.' },
  { title: 'Build in reviewed stages', text: 'You see working software as it develops and can correct course early.' },
  { title: 'Launch and hand over', text: 'We deploy the system and make sure your team can use and run it.' },
  { title: 'Improve and support', text: 'As the business changes, the software can change with it.' },
];

export default async function CustomSoftwareDevelopmentPage() {
  const project = await getVrCrmProject();
  const projectUrl = project ? getProjectUrl(project) : null;
  const technologies = project?.technologies ?? [];

  return (
    <div className="pt-[var(--header-height)]">
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Services', path: ROUTES.services }, { name: capability.title, path }])} />
      <JsonLd data={serviceJsonLd(capability)} />

      <ServiceBackBar />

      <ServiceHero
        badge="Custom Software Development"
        title="Custom software built around how your business works."
        intro="Zaref designs and develops software for a specific workflow or operational requirement, for businesses where off-the-shelf tools force workarounds or no product fits the way they operate."
      >
        <Button href={ROUTES.contact}>
          Discuss Your Project <ArrowRight size={16} />
        </Button>
        {projectUrl && (
          <Button href={projectUrl} variant="ghost">
            See the VR CRM case study <ArrowRight size={16} />
          </Button>
        )}
      </ServiceHero>

      <ServiceRows heading="When custom software makes sense." items={whenItems} />

      <ServiceRows
        heading="Examples of what we build."
        lead="These are the kinds of systems Zaref designs and develops. Delivered work is shown separately below."
        items={examples}
      />

      <ServiceSteps heading="How we work." steps={steps} />

      <Section padded={false} className="py-12 md:py-14">
        <Container>
          <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
            <h2 className={serviceH2}>Technology follows the requirement.</h2>
            <p className="max-w-[520px] leading-[1.7] text-muted md:pt-1.5">
              We select the stack around the product, workflow and integration needs rather than forcing every project into the same architecture.
            </p>
          </div>
        </Container>
      </Section>

      {project && projectUrl && (
        <Section padded={false} className={`${serviceSectionY} border-y border-border bg-surface-2`}>
          <Container>
            <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
              <h2 className={serviceH2}>Delivered work.</h2>
              <div className="border-t border-border pt-6 md:border-l md:border-t-0 md:pl-12 md:pt-0">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  {['Custom CRM', project.clientName].filter(Boolean).join(' · ')}
                </p>
                <h3 className="mb-4 text-[clamp(1.35rem,2.3vw,1.75rem)] font-bold leading-[1.25] tracking-[-0.01em] text-foreground">{project.title}</h3>
                <p className="mb-6 max-w-[560px] text-[1.02rem] leading-[1.75] text-muted">{project.description}</p>
                {technologies.length > 0 && (
                  <div className="mb-6 flex flex-wrap gap-1.5">
                    {technologies.map(t => (
                      <span key={t} className="rounded-md border border-border bg-surface px-2.5 py-1 text-[0.78rem] font-semibold text-muted">{t}</span>
                    ))}
                  </div>
                )}
                <Link href={projectUrl} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-dark">
                  Read the full case study <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </Container>
        </Section>
      )}

      <ServiceCta
        title="Have a workflow that off-the-shelf software doesn't fit?"
        text="Tell us what you're trying to run or improve, and we'll discuss the right approach."
        relatedHref="/services/business-systems"
        relatedLabel="Business systems & CRM"
      />
    </div>
  );
}
