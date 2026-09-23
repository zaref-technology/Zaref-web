import { cn } from '@/lib/cn';

type SectionProps = React.ComponentPropsWithoutRef<'section'> & {
  /** Set false to remove the default vertical padding (e.g. when a child element supplies its own). */
  padded?: boolean;
};

export function Section({ className, padded = true, children, ...props }: SectionProps) {
  return (
    <section className={cn(padded && 'py-20', className)} {...props}>
      {children}
    </section>
  );
}
