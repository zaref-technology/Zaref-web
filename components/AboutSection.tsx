import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

const principles = [
  { title: 'Business-first thinking', desc: 'We begin by understanding the operation, users and problem before deciding what technology should be built.' },
  { title: 'End-to-end engineering', desc: 'From product planning and interface development to APIs, deployment and integrations, we support the complete development lifecycle.' },
  { title: 'Built for the long term', desc: 'We build maintainable systems that can evolve as requirements, users and businesses grow.' },
];

export default function AboutSection() {
  return (
    <Section>
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
          <div>
            <Badge>About Zaref</Badge>
            <h2 className="text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.01em] text-foreground">
              We build technology around
              <br />
              how businesses actually work.
            </h2>
            <p className="mt-4 leading-[1.7] text-muted">
              Zaref is a software development company building custom digital products and business systems for companies, startups and organizations.
            </p>
            <p className="mt-4 leading-[1.7] text-muted">
              Our team works across software engineering, mobile development, web platforms, integrations and automation — taking projects from initial requirements through development, deployment and ongoing improvement.
            </p>
            <p className="mt-4 leading-[1.7] text-muted">
              Whether it&apos;s a customer-facing product or software that runs behind the business, we focus on building systems that are practical, scalable and maintainable.
            </p>
          </div>

          <Card hover={false} className="flex flex-col gap-6">
            {principles.map((p, i) => (
              <div key={p.title} className={i > 0 ? 'border-t border-border pt-6' : ''}>
                <h3 className="mb-1.5 text-[1.05rem] font-bold text-foreground">{p.title}</h3>
                <p className="text-[0.9rem] leading-[1.7] text-muted">{p.desc}</p>
              </div>
            ))}
          </Card>
        </div>
      </Container>
    </Section>
  );
}
