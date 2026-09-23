import Link from 'next/link';
import Image from 'next/image';
import { Star, Quote, ArrowRight } from 'lucide-react';
import { listTestimonials } from '@/services/testimonials.service';
import { TESTIMONIAL_AVATAR_GRADIENTS, initialsFromName } from '@/constants/testimonial';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';

function Avatar({ name, avatar, gradient, size }: { name: string; avatar: string; gradient: string; size: number }) {
  return (
    <div
      className="flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full font-bold text-white"
      style={{ width: size, height: size, background: avatar ? 'transparent' : gradient, fontSize: size * 0.32 }}
    >
      {avatar
        ? <Image src={avatar} alt={name} width={size} height={size} className="h-full w-full object-cover" />
        : initialsFromName(name)
      }
    </div>
  );
}

const DISPLAY_LIMIT = 4;

export default async function TestimonialsSection() {
  // Fetched without a limit so we know the true total — "View All" should only appear when
  // the homepage is actually truncating the collection, not whenever at least one exists.
  const allTestimonials = await listTestimonials();
  const totalCount = allTestimonials.length;
  const testimonials = allTestimonials.slice(0, DISPLAY_LIMIT);
  const count = testimonials.length;
  const hasMore = totalCount > DISPLAY_LIMIT;

  return (
    <Section className="border-t border-border bg-surface">
      <Container>
        {/* Section header */}
        <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge>Social Proof</Badge>
            <h2 className="text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.01em] text-foreground">What our clients say.</h2>
            <p className="mt-3 max-w-[480px] text-[1.05rem] leading-[1.6] text-muted">
              Feedback from businesses we&apos;ve worked with.
            </p>
          </div>
          {hasMore && (
            <Link
              href="/testimonials"
              className="inline-flex flex-shrink-0 items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              View All Testimonials <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {count === 0 ? (
          <div className="py-12 text-center text-muted">
            <Quote size={36} className="mx-auto mb-3 opacity-30" />
            <p>No testimonials yet — add them from the admin panel.</p>
          </div>
        ) : count === 1 ? (
          // A single genuine testimonial gets a strong editorial treatment, not a small
          // card floating in a mostly-empty section.
          (() => {
            const t = testimonials[0];
            return (
              <div className="mx-auto max-w-[720px] text-center">
                {t.rating > 0 && (
                  <div className="mb-6 flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} size={16} fill={i <= t.rating ? '#f59e0b' : 'none'} color={i <= t.rating ? '#f59e0b' : 'var(--border)'} />
                    ))}
                  </div>
                )}
                <p className="text-[clamp(1.25rem,2.4vw,1.65rem)] font-medium leading-[1.5] tracking-[-0.01em] text-foreground">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-8 flex items-center justify-center gap-3.5">
                  <Avatar name={t.name} avatar={t.avatar} gradient={TESTIMONIAL_AVATAR_GRADIENTS[0]} size={48} />
                  <div className="text-left">
                    <div className="font-bold text-foreground">{t.name}</div>
                    <div className="text-sm text-muted">
                      {[t.role, t.company].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()
        ) : (
          <div
            className={cn(
              count === 2
                ? 'mx-auto grid max-w-[760px] grid-cols-1 gap-6 sm:grid-cols-2'
                : 'flex gap-4 overflow-x-auto pb-4 [-webkit-overflow-scrolling:touch] snap-x snap-mandatory md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0'
            )}
          >
            {testimonials.map((t, idx) => (
              <div key={t.id} className={cn(count >= 3 && 'w-[280px] flex-shrink-0 snap-start md:w-auto')}>
                <Card className="flex h-full flex-col p-7">
                  {t.rating > 0 && (
                    <div className="mb-4 flex gap-[3px]">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} size={14} fill={i <= t.rating ? '#f59e0b' : 'none'} color={i <= t.rating ? '#f59e0b' : 'var(--border)'} />
                      ))}
                    </div>
                  )}

                  <p className="mb-5 line-clamp-5 flex-1 text-sm leading-[1.7] text-muted">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-3">
                    <Avatar name={t.name} avatar={t.avatar} gradient={TESTIMONIAL_AVATAR_GRADIENTS[idx % TESTIMONIAL_AVATAR_GRADIENTS.length]} size={40} />
                    <div>
                      <div className="text-[0.88rem] font-bold text-foreground">{t.name}</div>
                      <div className="text-xs text-muted">
                        {[t.role, t.company].filter(Boolean).join(' · ')}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
