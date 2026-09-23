import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { listTestimonials, withRelatedProjects } from '@/services/testimonials.service';
import { ROUTES } from '@/constants/routes';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { ClientQuote } from '@/components/ClientQuote';
import { cn } from '@/lib/cn';

/** The homepage shows a small curated subset (lowest `order` first), not a directory. */
const DISPLAY_LIMIT = 3;

export default async function TestimonialsSection() {
  const all = await listTestimonials();
  // No testimonials → no section at all (never a public empty state).
  if (all.length === 0) return null;

  const testimonials = await withRelatedProjects(all.slice(0, DISPLAY_LIMIT));
  const count = testimonials.length;
  const hasMore = all.length > DISPLAY_LIMIT;

  return (
    <Section className="border-t border-border bg-surface">
      <Container>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge>Client Perspective</Badge>
            <h2 className="max-w-[560px] text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.01em] text-foreground">
              What clients say about working with Zaref.
            </h2>
          </div>
          {hasMore && (
            <Link
              href={ROUTES.testimonials}
              className="inline-flex flex-shrink-0 items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              More client feedback <ArrowRight size={14} />
            </Link>
          )}
        </div>

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
      </Container>
    </Section>
  );
}
