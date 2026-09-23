import { cn } from '@/lib/cn';

/** A small, understated section label — deliberately not a pill/badge chip. */
export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        'mb-4 inline-block text-xs font-bold uppercase tracking-[0.14em] text-primary',
        className
      )}
    >
      {children}
    </span>
  );
}
