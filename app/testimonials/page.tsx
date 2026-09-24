import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { listTestimonials, withRelatedProjects } from '@/services/testimonials.service';
import { ROUTES } from '@/constants/routes';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { ClientQuote } from '@/components/ClientQuote';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbJsonLd } from '@/lib/structured-data';
import { DEFAULT_OG_IMAGES } from '@/constants/site';
import { cn } from '@/lib/cn';

const title = 'Client Feedback';
const description = 'Feedback from businesses that have worked with Zaref.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/testimonials' },
  openGraph: { title, description, url: '/testimonials', images: DEFAULT_OG_IMAGES },
  twitter: { title, description, images: DEFAULT_OG_IMAGES },
};

export const revalidate = 300;

export default async function TestimonialsPage() {
  const testimonials = await withRelatedProjects(await listTestimonials());
  const count = testimonials.length;

  return (
    <div className="pt-[var(--header-height)]">
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Client Feedback', path: '/testimonials' }])} />
      <section className="relative overflow-hidden border-b border-border bg-surface pb-16 pt-10 md:pb-20 md:pt-14">
        <Container>
          <div className="relative z-[1]">
            <Badge>Client Perspective</Badge>
            <h1 className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.1] text-foreground">
              What clients say about working with Zaref.
            </h1>
            <p className="mt-4 max-w-[600px] text-lg text-muted">
              Feedback from businesses we&apos;ve worked with. For what we&apos;ve actually built, see our work.
            </p>
            <Link
              href={ROUTES.work}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              View Our Work <ArrowRight size={14} />
            </Link>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          {count === 0 ? (
            <p className="text-muted">Client feedback will be published here.</p>
          ) : (
            <div
              className={cn(
                count === 1 ? 'max-w-[760px]' : 'grid grid-cols-1 gap-12 md:grid-cols-2',
                count >= 3 && 'lg:grid-cols-3'
              )}
            >
              {testimonials.map(t => (
                <ClientQuote
                  key={t.id}
                  quote={t.quote}
                  name={t.name}
                  role={t.role}
                  company={t.company}
                  avatar={t.avatar}
                  project={t.project}
                  size={count === 1 ? 'lg' : 'md'}
                />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
