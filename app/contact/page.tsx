import type { Metadata } from 'next';
import { getSiteSettings } from '@/services/settings.service';
import { SOCIAL_PLATFORMS } from '@/constants/social';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';
import ContactForm from './ContactForm';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbJsonLd } from '@/lib/structured-data';
import { DEFAULT_OG_IMAGES } from '@/constants/site';

/** LinkedIn is the strongest available B2B verification channel and always leads the
 * "Professional Presence" list when present; everything else keeps SOCIAL_PLATFORMS' order. */
const SOCIAL_PRIORITY = ['linkedin'];

const title = 'Contact';
const description = 'Tell Zaref what you’re building, improving or integrating. We review project details and follow up with the right next step.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/contact' },
  openGraph: { title, description, url: '/contact', images: DEFAULT_OG_IMAGES },
  twitter: { title, description, images: DEFAULT_OG_IMAGES },
};

export const revalidate = 300;

export default async function Contact() {
  const settings = await getSiteSettings();

  const activeSocials = SOCIAL_PLATFORMS
    .filter(i => settings[i.key])
    .sort((a, b) => {
      const ai = SOCIAL_PRIORITY.indexOf(a.key);
      const bi = SOCIAL_PRIORITY.indexOf(b.key);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

  // Phone and WhatsApp are frequently the same number — never present the same number under two
  // separate labels. Only split into two rows if they genuinely differ.
  const phone = settings.phone?.trim();
  const whatsapp = settings.whatsapp?.trim();
  const samePhoneNumber = !!phone && !!whatsapp && phone.replace(/\D/g, '') === whatsapp.replace(/\D/g, '');

  const directContact = samePhoneNumber
    ? [{ label: 'Direct Contact', value: phone!, href: `tel:${phone}`, note: 'Call · WhatsApp' }]
    : [
        ...(phone ? [{ label: 'Phone', value: phone, href: `tel:${phone}`, note: 'Call' }] : []),
        ...(whatsapp ? [{ label: 'WhatsApp', value: whatsapp, href: `https://wa.me/${whatsapp.replace(/\D/g, '')}`, note: 'Message' }] : []),
      ];

  return (
    <div className="pt-[var(--header-height)]">
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])} />
      {/* Header — left-aligned, same editorial grid as Services/Work/Company */}
      <section className="relative overflow-hidden border-b border-border bg-surface pb-16 pt-10 md:pb-20 md:pt-14">
        <Container>
          <div className="relative z-[1]">
            <Badge>Contact</Badge>
            <h1 className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.1] text-foreground">
              Tell us what you&apos;re looking to build.
            </h1>
            <p className="mt-4 max-w-[600px] text-lg text-muted">
              Share your project, business problem or existing system with us. We&apos;ll review the details and discuss the right next step.
            </p>
          </div>
        </Container>
      </section>

      {/* Content — single semantic structure, reordered per breakpoint (not duplicated DOM):
          intro, then the form (primary conversion action), then supporting contact information.
          Mobile stacks in that exact order via `order`. Desktop groups intro + info into one
          self-contained left column (via `contents` → `flex flex-col` at `lg`, NOT grid row
          spanning — a spanning grid item forces the CSS grid track-sizing algorithm to inflate
          the shorter column's rows to match the tall form, which is what previously pushed
          "Direct Contact" far down the page) so the form's height never affects the left
          column's internal rhythm. */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] lg:gap-16">
            {/* Left column wrapper — `contents` at mobile so it generates no box of its own and
                its children become direct grid items (order interleaves them with the form);
                a real flex column at `lg` so Intro + Info become one grid item, independent of
                the form's height */}
            <div className="contents lg:flex lg:flex-col lg:gap-10">
              {/* Intro */}
              <div className="order-1 lg:order-none">
                <h2 className="mb-3 text-2xl font-extrabold text-foreground">Get in Touch</h2>
                <p className="leading-[1.7] text-muted">
                  Tell us what you&apos;re building, what needs to improve, or where an existing process is creating friction. A short overview is enough to start — a complete specification isn&apos;t required upfront.
                </p>
              </div>

              {/* Supporting contact information — secondary to the form, not a competing directory */}
              <div className="order-3 flex flex-col divide-y divide-border lg:order-none">
                {settings.email && (
                  <div className="flex flex-col gap-1.5 pb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted">Email</span>
                    <a href={`mailto:${settings.email}`} className="text-[0.95rem] font-semibold text-foreground transition-colors hover:text-primary">
                      {settings.email}
                    </a>
                  </div>
                )}

                {directContact.map(method => (
                  <div key={method.label} className="flex flex-col gap-1.5 py-6 first:pt-0">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted">{method.label}</span>
                    <a href={method.href} target={method.href.startsWith('https://') ? '_blank' : undefined} rel="noopener noreferrer" className="text-[0.95rem] font-semibold text-foreground transition-colors hover:text-primary">
                      {method.value}
                    </a>
                    <span className="text-xs text-muted">{method.note}</span>
                  </div>
                ))}

                {activeSocials.length > 0 && (
                  <div className="flex flex-col gap-1.5 py-6 first:pt-0">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted">Professional Presence</span>
                    <div className="flex flex-col gap-1.5">
                      {activeSocials.map((s, i) => (
                        <a
                          key={s.key}
                          href={settings[s.key]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            'text-[0.95rem] font-semibold transition-colors hover:text-primary',
                            i === 0 ? 'text-foreground' : 'text-muted'
                          )}
                        >
                          {s.label}{i === 0 ? ' →' : ''}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form — the primary conversion action */}
            <div className="order-2 lg:order-none">
              <ContactForm />
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
