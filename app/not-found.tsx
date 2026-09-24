import type { Metadata } from 'next';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

// Served with a real 404 status and noindex (Next adds it for not-found). Own title so it never
// presents itself as the homepage; no canonical is declared.
export const metadata: Metadata = {
  title: 'Page not found',
  description: 'The page you were looking for could not be found.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="pt-[var(--header-height)]">
      <section className="border-b border-border bg-surface pb-16 pt-10 md:pb-20 md:pt-14">
        <Container>
          <Badge>404</Badge>
          <h1 className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.1] text-foreground">Page not found.</h1>
          <p className="mt-4 max-w-[600px] text-lg text-muted">
            The page you were looking for doesn&apos;t exist or has moved. These are good places to continue.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Button href={ROUTES.home}>Back to Home</Button>
            <Link href={ROUTES.work} className="text-sm font-semibold text-foreground transition-colors hover:text-primary">View Our Work</Link>
            <Link href={ROUTES.services} className="text-sm font-semibold text-foreground transition-colors hover:text-primary">Explore Services</Link>
            <Link href={ROUTES.contact} className="text-sm font-semibold text-foreground transition-colors hover:text-primary">Discuss Your Project</Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
