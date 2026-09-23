'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { cn } from '@/lib/cn';

type Slide =
  | { type: 'video'; embedUrl: string }
  | { type: 'image'; url: string; alt: string; caption?: string };

export function MediaCarousel({ images, gallery, embedUrl, color, title }: {
  images: string[];
  /** Structured gallery with per-image alt/caption. Falls back to `images` when absent. */
  gallery?: { url: string; alt?: string; caption?: string }[];
  embedUrl: string | null;
  color: string;
  title: string;
}) {
  const items: { url: string; alt?: string; caption?: string }[] =
    gallery && gallery.length > 0 ? gallery : images.map(url => ({ url }));
  const slides: Slide[] = [
    ...(embedUrl ? [{ type: 'video' as const, embedUrl }] : []),
    ...items.map((item, i) => ({ type: 'image' as const, url: item.url, alt: item.alt || `${title} screenshot ${i + 1}`, caption: item.caption })),
  ];

  const [idx, setIdx] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const prev = () => setIdx(i => (i - 1 + slides.length) % slides.length);
  const next = () => setIdx(i => (i + 1) % slides.length);

  const onTouchStart = (e: React.TouchEvent) => { setTouchStart(e.touches[0].clientX); };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const delta = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      if (delta > 0) next(); else prev();
    }
    setTouchStart(null);
  };

  if (slides.length === 0) {
    return (
      <div
        className="flex aspect-video w-full items-center justify-center rounded-2xl border-[1.5px] text-8xl font-black"
        style={{ background: `linear-gradient(135deg, ${color}18, ${color}40)`, borderColor: `${color}33`, color }}
      >
        {title.charAt(0)}
      </div>
    );
  }

  const current = slides[idx];

  const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

  return (
    <div className="relative w-full" role="region" aria-roledescription="carousel" aria-label={`${title} media`}>
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={cn(
          'relative aspect-video w-full select-none overflow-hidden rounded-2xl',
          current.type === 'video' ? 'bg-black' : 'bg-surface-2'
        )}
      >
        {current.type === 'video' ? (
          <iframe
            src={current.embedUrl}
            title={`${title} demo video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-none"
          />
        ) : (
          <>
            <Image
              src={current.url}
              alt={current.alt}
              fill
              sizes="(min-width: 900px) calc(100vw - 400px), 100vw"
              priority={idx === 0}
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/[0.28] to-transparent to-50%" />
          </>
        )}

        <div aria-live="polite" className="absolute right-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[0.72rem] font-bold text-white backdrop-blur-sm">
          {current.type === 'video' && <Play size={11} fill="#fff" color="#fff" aria-hidden="true" />}
          <span className="sr-only">Slide </span>{idx + 1} / {slides.length}
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className={cn('absolute left-2.5 top-1/2 flex h-[38px] w-[38px] -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/70', focusRing)}
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className={cn('absolute right-2.5 top-1/2 flex h-[38px] w-[38px] -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/70', focusRing)}
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </>
        )}

        {slides.length > 1 && (
          <div role="group" aria-label="Choose slide" className="absolute bottom-1 left-1/2 flex -translate-x-1/2">
            {slides.map((_, i) => (
              // The hit target is 24x24 (WCAG 2.5.8); the visible dot stays small inside it.
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Show slide ${i + 1} of ${slides.length}`}
                aria-current={i === idx ? 'true' : undefined}
                className={cn('flex h-6 min-w-6 items-center justify-center rounded-full', focusRing)}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'block h-[7px] rounded-full transition-all',
                    i === idx ? 'w-5 bg-white shadow-[0_0_6px_rgba(255,255,255,0.7)]' : 'w-[7px] bg-white/45'
                  )}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {current.type === 'image' && current.caption && (
        <p className="mt-2.5 text-sm text-muted">{current.caption}</p>
      )}

      {/* Thumbnail strip — only for image slides */}
      {slides.filter(s => s.type === 'image').length > 1 && (
        <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {slides.map((s, i) => {
            const isActive = i === idx;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                aria-current={isActive ? 'true' : undefined}
                aria-label={s.type === 'video' ? 'Show video demo' : undefined}
                className={cn(
                  'h-[50px] w-[68px] flex-shrink-0 overflow-hidden rounded-lg transition-all',
                  // Keyboard focus always gets a high-contrast outline — the resting outline
                  // must never be `transparent` on focus, or it hides the browser's own ring.
                  'focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground',
                  isActive ? 'opacity-100 outline outline-[2.5px] outline-[color:var(--thumb-color)]' : 'opacity-50',
                  s.type === 'video' ? 'bg-black' : 'bg-surface-2'
                )}
                style={{ '--thumb-color': color } as React.CSSProperties}
              >
                {s.type === 'video' ? (
                  <div className="flex h-full w-full items-center justify-center bg-black">
                    <Play size={18} fill="#fff" color="#fff" />
                  </div>
                ) : (
                  <Image src={s.url} alt={s.alt} width={68} height={50} className="h-full w-full object-cover" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
