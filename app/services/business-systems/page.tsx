import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { JsonLd } from '@/components/JsonLd';
import { ServiceBackBar, ServiceCta, ServiceHero, ServiceRows, ServiceSteps, getVrCrmProject, serviceH2, serviceSectionY } from '@/components/ServicePage';
import { CAPABILITIES } from '@/constants/capabilities';
import { DEFAULT_OG_IMAGES } from '@/constants/site';
import { ROUTES, getProjectUrl } from '@/constants/routes';
import { breadcrumbJsonLd, serviceJsonLd } from '@/lib/structured-data';

const capability = CAPABILITIES.find(c => c.slug === 'business-systems')!;
const path = capability.pagePath!;

const title = 'Business Systems & CRM Development';
const description = 'CRM, admin and workflow systems built around how your business operates. See VR CRM, a custom CRM Zaref delivered for a solar business.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, images: DEFAULT_OG_IMAGES },
  twitter: { title, description, images: DEFAULT_OG_IMAGES },
};

export const revalidate = 300;

const whenItems = [
  { title: 'Leads and follow-ups live in spreadsheets and chat threads.' },
  { title: 'Nobody has one view of customers, payments or status.' },
  { title: "Admin work repeats because your tools don't talk to each other." },
];

// Capabilities evidenced by the VR CRM case study — the only ones marked "Delivered".
const deliveredInVrCrm = [
  'Lead & client management',
  'Quotations & proposals',
  'Task & follow-up tracking',
  'Payment & revenue tracking',
  'WhatsApp communication (templates)',
  'Centralized dashboard & reports',
];

// Examples of possible scope — deliberately NOT marked as delivered.
const shapedSystems = [
  'Operations & job tracking',
  'Inventory & order management',
  'Booking & scheduling',
  'Admin & back-office platforms',
  'Reporting dashboards',
];

const steps = [
  { title: 'Map the current process', text: 'Who does what today, which tools are involved and where time is lost.' },
  { title: 'Model the data', text: 'Define the customers, records and relationships the system has to keep track of.' },
  { title: 'Build the core workflow first', text: 'Get the main path working end to end before adding the extras.' },
  { title: 'Connect and report', text: 'Link the systems you already use and put clear reporting on top.' },
];

export default async function BusinessSystemsPage() {
  const project = await getVrCrmProject();
  const projectUrl = project ? getProjectUrl(project) : null;
  const technologies = project?.technologies ?? [];
  const shot = project?.gallery?.[0] ?? (project?.images?.[0] ? { url: project.images[0], alt: undefined } : null);

  return (
    <div className="pt-[var(--header-height)]">
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Services', path: ROUTES.services }, { name: capability.title, path }])} />
      <JsonLd data={serviceJsonLd(capability)} />

      <ServiceBackBar />

      <ServiceHero
        badge="Business Systems & CRM"
        title="Business systems and CRM built around your process."
        intro="Zaref builds the software that runs day-to-day operations, from CRM and lead management to workflows, admin tools and reporting, designed around how your team actually works."
      >
        <Button href={ROUTES.contact}>
          Discuss Your Project <ArrowRight size={16} />
        </Button>
        {projectUrl && (
          <Button href={projectUrl} variant="ghost">
            View the VR CRM case study <ArrowRight size={16} />
          </Button>
        )}
      </ServiceHero>

      <ServiceRows heading="When a business system makes sense." items={whenItems} />

      {project && projectUrl && (
        <Section padded={false} className={`${serviceSectionY} border-y border-border bg-surface-2`}>
          <Container>
            <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-14">
              <div>
                <h2 className={`${serviceH2} mb-4`}>Delivered: a CRM for a solar business.</h2>
                <p className="mb-8 leading-[1.7] text-muted">
                  VR CRM is a custom CRM Zaref built for {project.clientName || 'VR SolarTech'} to manage leads, clients, follow-ups, tasks, quotations, payments, revenue tracking and WhatsApp communication from one centralized dashboard.
                </p>
                <ul className="m-0 mb-6 flex list-none flex-col p-0">
                  {deliveredInVrCrm.map(item => (
                    <li key={item} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-border py-3">
                      <span className="flex items-center gap-2.5 text-[0.95rem] font-medium text-foreground">
                        <Check size={16} className="flex-shrink-0 text-primary" aria-hidden="true" />
                        {item}
                      </span>
                      <span className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-primary">Delivered in VR CRM</span>
                    </li>
                  ))}
                </ul>
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
              {shot && (
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-surface">
                  <Image
                    src={shot.url}
                    alt={shot.alt || `${project.title} screenshot`}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </Container>
        </Section>
      )}

      <Section padded={false} className={serviceSectionY}>
        <Container>
          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
            <div>
              <h2 className={`${serviceH2} mb-4`}>Systems shaped around your workflow.</h2>
              <p className="max-w-[480px] leading-[1.7] text-muted">
                CRM is where many businesses start, but a business system can extend well beyond it, depending on the process it needs to support. The scope comes from your workflow, not from a fixed product.
              </p>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-foreground">Depending on the business, that can include:</p>
              <ul className="m-0 mb-5 flex list-none flex-col p-0">
                {shapedSystems.map(item => (
                  <li key={item} className="border-t border-border py-3 text-[0.95rem] font-medium text-foreground last:border-b">{item}</li>
                ))}
              </ul>
              <p className="text-sm leading-[1.7] text-muted">
                Each one starts from your process, so treat these as examples of scope, not a product catalogue.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <ServiceSteps heading="How we approach it." steps={steps} />

      <ServiceCta
        title="Want a system built around your process?"
        text="Describe how your team works today and where it slows down, and we'll discuss what a system for it could look like."
        relatedHref="/services/custom-software-development"
        relatedLabel="Custom software development"
      />
    </div>
  );
}
