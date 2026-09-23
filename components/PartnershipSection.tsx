import { ArrowRight, Check } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

const forBusinesses = [
  'Custom software',
  'Business systems',
  'Process digitization',
  'Mobile applications',
  'Integrations & automation',
  'Ongoing software support',
];

const forTeams = [
  'Frontend & backend engineering',
  'Web application development',
  'Mobile development',
  'Feature development',
  'API integration',
  'Existing product improvements',
  'Ongoing engineering support',
];

function PathList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-[#7ba8f5]">{title}</h3>
      <ul className="m-0 flex flex-col gap-3 p-0">
        {items.map((item) => (
          <li key={item} className="flex list-none items-center gap-2.5 text-sm font-medium text-white/90">
            <Check size={16} className="flex-shrink-0 text-[#7ba8f5]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Deliberately dark — the one strategic dark section on an otherwise light homepage, per the
 * brand's "restrained, not everything dark" direction. Colors are hardcoded, not theme tokens,
 * so it reads the same regardless of the site's light/dark mode.
 */
export default function PartnershipSection() {
  return (
    <section className="bg-[#0b1018] py-20 md:py-24">
      <Container>
        <div className="mx-auto mb-12 max-w-[640px] text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-[#7ba8f5]">Flexible Development Partnerships</p>
          <h2 className="text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.15] tracking-[-0.01em] text-white">Your software development partner.</h2>
          <p className="mx-auto mt-4 leading-[1.7] text-white/60">
            From complete product development to extending an existing engineering team, Zaref provides flexible software development support based on what your business needs.
          </p>
          <div className="mt-7 flex justify-center">
            <Button href="/contact">
              Discuss Your Requirements <ArrowRight size={16} />
            </Button>
          </div>
        </div>

        <div className="mx-auto grid max-w-[760px] grid-cols-1 gap-10 border-t border-white/10 pt-12 sm:grid-cols-2 sm:gap-8 md:gap-16">
          <PathList title="For Businesses" items={forBusinesses} />
          <PathList title="For Product Teams & Agencies" items={forTeams} />
        </div>
      </Container>
    </section>
  );
}
