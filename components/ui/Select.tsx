import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'w-full cursor-pointer rounded-[0.65rem] border-[1.5px] border-control-border bg-surface-2 aria-invalid:border-danger aria-invalid:focus:ring-danger/25 px-4 py-3 text-[0.95rem] text-foreground outline-none transition-colors focus:border-primary focus:ring-[3px] focus:ring-primary/20',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = 'Select';
