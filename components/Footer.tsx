import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';
import { getSiteSettings } from '@/services/settings.service';
import { CAPABILITIES } from '@/constants/capabilities';
import { SOCIAL_PLATFORMS } from '@/constants/social';
import { ROUTES } from '@/constants/routes';

const footerLink = 'text-sm font-medium text-muted transition-colors hover:text-primary-light';
const contactRow = 'flex items-center gap-2 text-sm text-muted transition-colors hover:text-primary-light';
const contactRowStatic = 'flex items-center gap-2 text-sm text-muted';
const colHeading = 'mb-4 text-xs font-bold uppercase tracking-wider text-foreground';

const companyLinks = [
  { href: ROUTES.company, label: 'Company' },
  { href: ROUTES.work, label: 'Work' },
  { href: ROUTES.contact, label: 'Contact' },
];

export default async function Footer() {
  const year = new Date().getFullYear();
  const settings = await getSiteSettings();

  const socials = SOCIAL_PLATFORMS.filter(s => settings[s.key]);

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto max-w-[1200px] px-6 pb-8 pt-14">
        {/* Top grid */}
        <div className="mb-12 grid gap-10 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
          {/* Brand column */}
          <div>
            <Link href="/" className="mb-3.5 inline-flex items-center">
              <span className="relative inline-block h-7 w-auto" style={{ aspectRatio: '1724 / 369' }}>
                <Image src="/zaref-logo-full-light.png" alt={settings.siteName || 'Zaref'} fill sizes="120px" className="object-contain object-left dark:hidden" />
                <Image src="/zaref-logo-full-dark.png" alt={settings.siteName || 'Zaref'} fill sizes="120px" className="hidden object-contain object-left dark:block" />
              </span>
            </Link>
            <p className="mb-5 max-w-[220px] text-[0.865rem] leading-[1.7] text-muted">
              Software built for real business.
            </p>
            {socials.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {socials.map(({ key, icon: Icon, label }) => (
                  <a
                    key={key}
                    href={settings[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-border bg-surface-2 text-muted transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Company */}
          <div>
            <div className={colHeading}>Company</div>
            <div className="flex flex-col gap-2.5">
              {companyLinks.map(l => (
                <Link key={l.href} href={l.href} className={footerLink}>{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <Link href={ROUTES.services} className={`${colHeading} inline-block transition-colors hover:text-primary`}>Services</Link>
            <div className="flex flex-col gap-2.5">
              {CAPABILITIES.map(cap => (
                <Link key={cap.n} href={`${ROUTES.services}#${cap.slug}`} className={footerLink}>{cap.title}</Link>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <div className={colHeading}>Connect</div>
            <div className="flex flex-col gap-2.5">
              {settings.email && (
                <a href={`mailto:${settings.email}`} className={contactRow}>
                  <Mail size={14} className="flex-shrink-0" />
                  <span>{settings.email}</span>
                </a>
              )}
              {settings.phone && (
                <a href={`tel:${settings.phone}`} className={contactRow}>
                  <Phone size={14} className="flex-shrink-0" />
                  <span>{settings.phone}</span>
                </a>
              )}
              {settings.location && (
                <span className={contactRowStatic}>
                  <MapPin size={14} className="flex-shrink-0" />
                  <span>{settings.location}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
          <p className="text-[0.82rem] text-muted">
            © {year} Zaref. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
