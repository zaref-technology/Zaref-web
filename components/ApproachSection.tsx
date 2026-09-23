import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';

const principles = [
  { n: '01', title: 'Understand before building', desc: 'We start by learning how the business actually works before writing a line of code.' },
  { n: '02', title: 'Design around the user', desc: 'Every screen and workflow is built around the person who has to use it daily.' },
  { n: '03', title: 'Engineer for maintainability', desc: 'Code that a future team — including you — can read, change and extend with confidence.' },
  { n: '04', title: 'Communicate clearly', desc: 'No jargon, no black boxes. You always know what is being built and why.' },
  { n: '05', title: 'Ship, learn and improve', desc: 'We release early, gather real feedback, and iterate rather than guessing upfront.' },
];

export default function ApproachSection() {
  return (
    <Section>
      <Container>
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-14">
          <div>
            <Badge>Approach</Badge>
            <h2 className="text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.01em] text-foreground">
              Built with purpose.
              <br />
              Engineered for the long run.
            </h2>
            <p className="mt-4 max-w-[440px] leading-[1.7] text-muted">
              We don&apos;t start with technology for technology&apos;s sake. We start with the problem, understand what the business actually needs, and build the simplest reliable solution that can grow with it.
            </p>
          </div>
          <div>
            {principles.map((p, i) => (
              <div
                key={p.n}
                className={`flex gap-6 border-t border-border py-6 ${i === principles.length - 1 ? 'pb-0' : ''}`}
              >
                <span className="flex-shrink-0 pt-0.5 text-sm font-bold text-primary">{p.n}</span>
                <div>
                  <h3 className="mb-1.5 text-[1.05rem] font-bold text-foreground">{p.title}</h3>
                  <p className="text-[0.925rem] leading-[1.7] text-muted">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
