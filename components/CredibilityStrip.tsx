import { Container } from '@/components/ui/Container';

const items = [
  'Custom Software',
  'Web Platforms',
  'Mobile Applications',
  'Business Systems',
  'Automation',
];

export default function CredibilityStrip() {
  return (
    <section className="border-y border-border bg-surface-2">
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-6">
          {items.map((item) => (
            <span
              key={item}
              className="text-xs font-bold uppercase tracking-[0.12em] text-muted"
            >
              {item}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
