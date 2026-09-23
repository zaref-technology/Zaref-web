import { cn } from '@/lib/cn';

type CardProps = React.ComponentPropsWithoutRef<'div'> & {
  /** Lift + border-glow on hover. Off for cards that aren't interactive. */
  hover?: boolean;
};

export function Card({ className, hover = true, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-surface p-8 transition-all duration-200',
        hover && 'hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-[0_12px_32px_rgba(16,24,40,0.08)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
