import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { listProjects } from '@/services/projects.service';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { DEFAULT_OG_IMAGES } from '@/constants/site';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbJsonLd } from '@/lib/structured-data';
import WorkGrid from './WorkGrid';

const title = 'Work';
const description = 'Case studies of the software, platforms and business systems Zaref has designed and built for companies and organizations.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/work' },
  openGraph: { title, description, url: '/work', images: DEFAULT_OG_IMAGES },
  twitter: { title, description, images: DEFAULT_OG_IMAGES },
};

export const revalidate = 300;

export default async function WorkPage() {
  const rawProjects = await listProjects();
  // Firestore Timestamp objects aren't plain-serializable and can't cross into the
  // WorkGrid Client Component; WorkGrid doesn't need them anyway.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructured only to exclude these from `rest`
  const projects = rawProjects.map(({ createdAt, updatedAt, ...rest }) => rest);

  return (
    <div className="pt-[var(--header-height)]">
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Work', path: '/work' }])} />
      {/* Header — left-aligned, same editorial family as Services/Company */}
      <section className="relative overflow-hidden border-b border-border bg-surface pb-16 pt-10 md:pb-20 md:pt-14">
        <Container>
          <div className="relative z-[1]">
            <Badge>Work</Badge>
            <h1 className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.1] text-foreground">
              Real software. Built for real business.
            </h1>
            <p className="mt-4 max-w-[600px] text-lg text-muted">
              Explore software, platforms and business systems we&apos;ve built around real operational needs.
            </p>
          </div>
        </Container>
      </section>

      {/* Filter + Grid */}
      <section className="pt-10">
        <Container>
          <WorkGrid projects={projects} />
        </Container>
      </section>

      {/* Closing CTA — same restrained dark treatment used on Home/Services/Case Study,
          connecting proof of past work to the next conversation */}
      <section className="bg-[#0b1018] py-20 md:py-24">
        <Container>
          <div className="mx-auto max-w-[600px] text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-[#7ba8f5]">Start a Project</p>
            <h2 className="mb-4 text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.01em] text-white">
              Have a system or product in mind?
            </h2>
            <p className="mx-auto mb-8 text-[1.05rem] leading-[1.6] text-white/60">
              Tell us what you&apos;re looking to build or improve, and we&apos;ll discuss the right technical approach.
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
