import Link from 'next/link';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'outline' | 'ghost';
type Size = 'sm' | 'md';

interface CommonProps {
  variant?: Variant;
  size?: Size;
  /** Fully rounded pill shape, used in nav/hero CTAs. */
  pill?: boolean;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsLink = CommonProps & {
  href: string;
  external?: boolean;
  onClick?: () => void;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    href?: undefined;
  };

type ButtonProps = ButtonAsLink | ButtonAsButton;

const base =
  'inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  outline: 'border border-border bg-transparent text-foreground hover:border-foreground/30 hover:bg-foreground/[0.03]',
  ghost: 'text-foreground underline-offset-4 hover:text-primary hover:underline',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-[0.95rem]',
};

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    pill = false,
    fullWidth = false,
    className,
    children,
  } = props;

  const classes = cn(
    base,
    variants[variant],
    sizes[size],
    pill ? 'rounded-full' : 'rounded-lg',
    fullWidth && 'w-full',
    className
  );

  if ('href' in props && props.href) {
    const { href, external, onClick } = props;
    const isExternal = external || /^(mailto:|tel:|https?:\/\/)/.test(href);
    if (isExternal) {
      return (
        <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" onClick={onClick} className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} onClick={onClick} className={classes}>
        {children}
      </Link>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructured only to exclude these from `rest`
  const { variant: v, size: s, pill: p, fullWidth: fw, className: cn2, children: c, type = 'button', ...rest } = props as ButtonAsButton;

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
