import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight, Quote, Star } from 'lucide-react';
import { listTestimonials } from '@/services/testimonials.service';
import { TESTIMONIAL_AVATAR_GRADIENTS, initialsFromName } from '@/constants/testimonial';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbJsonLd } from '@/lib/structured-data';
import { DEFAULT_OG_IMAGES } from '@/constants/site';

const title = 'Testimonials';
const description = 'What clients say about working with Zaref.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/testimonials' },
  openGraph: { title, description, url: '/testimonials', images: DEFAULT_OG_IMAGES },
  twitter: { title, description, images: DEFAULT_OG_IMAGES },
};

export const revalidate = 300;

export default async function TestimonialsPage() {
  const testimonials = await listTestimonials();

  return (
    <div className="pt-[var(--header-height)]">
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Testimonials', path: '/testimonials' }])} />
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-surface pb-16 pt-10 md:pb-20 md:pt-14">
        <Container>
          <div className="relative z-[1] text-center">
            <Badge className="mx-auto">Social Proof</Badge>
            <h1 className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.1] text-foreground">What Clients Say</h1>
            <p className="mx-auto mt-4 mb-8 max-w-[600px] text-lg text-muted">
              Real feedback from real people who trusted us with their projects.
            </p>
            <Button href="/contact">
              Work With Us <ArrowRight size={16} />
            </Button>
          </div>
        </Container>
      </section>

      {/* Grid */}
      <Section>
        <Container>
          {testimonials.length === 0 ? (
            <div className="py-20 text-center">
              <Quote size={48} className="mx-auto mb-4 text-muted opacity-30" />
              <h2 className="mb-2 font-bold text-foreground">No testimonials yet</h2>
              <p className="text-muted">Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]">
              {testimonials.map((t, idx) => (
                <Card key={t.id} className="relative flex flex-col overflow-hidden">
                  <Quote size={40} className="absolute right-5 top-4 text-foreground opacity-[0.06]" />

                  <div className="mb-4 flex gap-[3px]">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} size={15} fill={i <= t.rating ? '#f59e0b' : 'none'} color={i <= t.rating ? '#f59e0b' : 'var(--border)'} />
                    ))}
                  </div>

                  <p className="mb-6 flex-1 text-[0.95rem] italic leading-[1.75] text-muted">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-3.5">
                    <div
                      className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-bold text-white"
                      style={{ background: t.avatar ? 'transparent' : TESTIMONIAL_AVATAR_GRADIENTS[idx % TESTIMONIAL_AVATAR_GRADIENTS.length] }}
                    >
                      {t.avatar
                        ? <Image src={t.avatar} alt={t.name} width={44} height={44} className="h-full w-full object-cover" />
                        : initialsFromName(t.name)
                      }
                    </div>
                    <div>
                      <div className="text-[0.95rem] font-bold text-foreground">{t.name}</div>
                      <div className="text-[0.8rem] text-muted">
                        {[t.role, t.company].filter(Boolean).join(' · ')}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </Section>

      {/* CTA */}
      <Section className="border-t border-border bg-surface">
        <Container>
          <div className="text-center">
            <h2 className="mb-4 text-[clamp(1.8rem,4vw,3rem)] font-extrabold text-foreground">
              Have a software challenge <span className="text-primary">worth solving?</span>
            </h2>
            <p className="mb-8 text-[1.05rem] text-muted">Let&apos;s build something great together.</p>
            <Button href="/contact">
              Discuss Your Project <ArrowRight size={16} />
            </Button>
          </div>
        </Container>
      </Section>
    </div>
  );
}
