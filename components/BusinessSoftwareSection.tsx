import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { BUSINESS_SOLUTIONS } from '@/constants/solutions';

export default function BusinessSoftwareSection() {
  return (
    <Section id="solutions" className="scroll-mt-[var(--header-height)] border-y border-border bg-surface-2">
      <Container>
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
          <div>
            <Badge>For Businesses</Badge>
            <h2 className="text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.01em] text-foreground">
              Software built around
              <br />
              how your business works.
            </h2>
            <p className="mt-4 max-w-[460px] leading-[1.7] text-muted">
              Off-the-shelf software doesn&apos;t always fit the way a business operates. Zaref builds custom systems around real processes — helping teams manage operations, customers, data and workflows more effectively.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            {BUSINESS_SOLUTIONS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className={`flex items-center gap-3 border-t border-border py-4 ${i >= BUSINESS_SOLUTIONS.length - 2 ? 'sm:border-b' : ''}`}
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-border bg-surface">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
