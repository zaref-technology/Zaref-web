import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'w-full resize-y rounded-[0.65rem] border-[1.5px] border-control-border bg-surface-2 aria-invalid:border-danger aria-invalid:focus:ring-danger/25 px-4 py-3 text-[0.95rem] text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-[3px] focus:ring-primary/20',
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';
