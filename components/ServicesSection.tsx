import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CAPABILITIES } from '@/constants/capabilities';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';

export default function ServicesSection() {
  return (
    <Section>
      <Container>
        {/* Section header */}
        <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge>What We Do</Badge>
            <h2 className="text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.01em] text-foreground">What we build.</h2>
            <p className="mt-3 max-w-[520px] text-[1.05rem] leading-[1.6] text-muted">
              We design and develop software around real business needs — from customer-facing products to internal systems, integrations and automation.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex flex-shrink-0 items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-primary"
          >
            Explore Services <ArrowRight size={14} />
          </Link>
        </div>

        {/* Editorial capability list — one accent color, no rainbow icons */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-12">
          {CAPABILITIES.map(cap => {
            const Icon = cap.icon;
            return (
              <div key={cap.n} className="flex gap-5 border-t border-border py-7">
                <div className="flex-shrink-0">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-surface-2">
                    <Icon size={20} className="text-primary" />
                  </div>
                </div>
                <div>
                  <div className="mb-1.5 flex items-center gap-2.5">
                    <span className="text-xs font-bold text-muted">{cap.n}</span>
                    <h3 className="text-[1.05rem] font-bold text-foreground">
                      <Link href={`/services#${cap.slug}`} className="transition-colors hover:text-primary">
                        {cap.title}
                      </Link>
                    </h3>
                  </div>
                  <p className="text-sm leading-[1.65] text-muted">{cap.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
