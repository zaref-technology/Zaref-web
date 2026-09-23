import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-[var(--header-height)]">
      {/* Extremely subtle technical grid — restrained per brand direction */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_1px_1px,color-mix(in_srgb,var(--foreground)_6%,transparent)_1px,transparent_0)] [background-size:48px_48px]" />

      <Container>
        <div className="relative z-[1] grid grid-cols-1 items-center gap-10 pb-16 pt-10 md:pb-20 md:pt-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          {/* Left — typography-led content */}
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Software Development · Digital Products · Automation
            </p>

            <h1 className="mb-6 text-[clamp(2.25rem,4.2vw,3.5rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-foreground">
              We build software
              <br />
              <span className="text-primary">businesses run on.</span>
            </h1>

            <p className="mb-9 max-w-[640px] text-[clamp(1rem,1.6vw,1.15rem)] leading-[1.7] text-muted">
              Zaref designs and develops custom software, web platforms, mobile applications and business systems built around real operational needs.
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <Button href={ROUTES.contact}>
                Discuss Your Project <ArrowRight size={16} />
              </Button>
              <Button href={ROUTES.work} variant="ghost">
                View Our Work <ArrowRight size={16} />
              </Button>
            </div>
          </div>

          {/* Right — a restrained abstract technical composition, secondary to the headline */}
          <div className="relative hidden self-start justify-center pt-2 lg:flex">
            <div className="relative aspect-[4/3] w-full max-w-[360px]">
              <div className="pointer-events-none absolute inset-0 rounded-lg bg-[radial-gradient(circle_at_1px_1px,color-mix(in_srgb,var(--foreground)_7%,transparent)_1px,transparent_0)] [background-size:26px_26px]" />

              <svg viewBox="0 0 360 270" fill="none" aria-hidden="true" className="absolute inset-0 h-full w-full">
                <path d="M28 214 H148 V132 H238 V68 H332" stroke="color-mix(in srgb, var(--foreground) 22%, transparent)" strokeWidth="1.4" />
                <path d="M28 214 H148 V132" stroke="var(--primary)" strokeWidth="1.25" strokeOpacity="0.5" />
                <rect x="202" y="44" width="48" height="32" rx="3" stroke="color-mix(in srgb, var(--foreground) 22%, transparent)" strokeWidth="1.4" strokeDasharray="3 3" />
                <circle cx="28" cy="214" r="4" fill="var(--surface)" stroke="color-mix(in srgb, var(--foreground) 22%, transparent)" strokeWidth="1.4" />
                <circle cx="148" cy="132" r="4" fill="var(--surface)" stroke="var(--primary)" strokeWidth="1.5" />
                <circle cx="238" cy="68" r="4" fill="var(--surface)" stroke="color-mix(in srgb, var(--foreground) 22%, transparent)" strokeWidth="1.4" />
                <circle cx="332" cy="68" r="4" fill="var(--surface)" stroke="color-mix(in srgb, var(--foreground) 22%, transparent)" strokeWidth="1.4" />
              </svg>

              <span
                className="absolute left-[3%] top-[81%] text-[10px] font-semibold uppercase tracking-[0.14em]"
                style={{ color: 'color-mix(in srgb, var(--muted) 82%, var(--foreground) 18%)' }}
              >
                Systems
              </span>
              <span
                className="absolute left-[64%] top-[16%] text-[10px] font-semibold uppercase tracking-[0.14em]"
                style={{ color: 'color-mix(in srgb, var(--muted) 82%, var(--foreground) 18%)' }}
              >
                Engineering
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
