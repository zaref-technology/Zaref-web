import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ClientQuoteProps {
  quote: string;
  name: string;
  role?: string;
  company?: string;
  /** Real photo URL only — there is deliberately no generated placeholder when absent. */
  avatar?: string;
  /** Resolved from an explicit testimonial → project relationship; omitted otherwise. */
  project?: { title: string; url: string };
  size?: 'lg' | 'md';
}

/** Shared editorial client-quote presentation used by the homepage, /testimonials and case
 * studies. The client's words are rendered exactly as stored (line breaks preserved). Role and
 * company only render when real values exist. */
export function ClientQuote({ quote, name, role, company, avatar, project, size = 'md' }: ClientQuoteProps) {
  const context = [role, company].map(v => v?.trim()).filter(Boolean).join(' · ');

  return (
    <figure className="m-0">
      <blockquote className="m-0 border-l-2 border-primary pl-6">
        <p
          className={cn(
            'whitespace-pre-line text-foreground',
            size === 'lg'
              ? 'text-[clamp(1.2rem,2.2vw,1.55rem)] font-medium leading-[1.55] tracking-[-0.01em]'
              : 'text-base leading-[1.7]'
          )}
        >
          {quote}
        </p>
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 pl-6">
        {avatar && (
          <Image
            src={avatar}
            alt={`Photo of ${name}`}
            width={40}
            height={40}
            className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
          />
        )}
        <div>
          <div className="font-semibold text-foreground">{name}</div>
          {context && <div className="text-sm text-muted">{context}</div>}
        </div>
      </figcaption>
      {project && (
        <div className="mt-4 pl-6">
          <Link
            href={project.url}
            aria-label={`View related case study: ${project.title}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-primary"
          >
            View related case study <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </figure>
  );
}
