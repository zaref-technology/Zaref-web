import type { Metadata } from 'next';
import { getSiteSettings } from '@/services/settings.service';
import { CONTACT_INFO_ITEMS } from '@/constants/contact';
import { SOCIAL_PLATFORMS } from '@/constants/social';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import ContactForm from './ContactForm';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbJsonLd } from '@/lib/structured-data';
import { DEFAULT_OG_IMAGES } from '@/constants/site';

const title = 'Discuss Your Project';
const description = 'Tell Zaref about your project — websites, custom software, integrations and automation for businesses and organizations.';

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

  const activeInfo = CONTACT_INFO_ITEMS.filter(i => settings[i.key]);
  const activeSocials = SOCIAL_PLATFORMS.filter(i => settings[i.key]);

  return (
    <div className="pt-[var(--header-height)]">
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])} />
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border bg-surface pb-16 pt-10 md:pb-20 md:pt-14">
        <Container>
          <div className="relative z-[1] text-center">
            <Badge className="mx-auto">Contact</Badge>
            <h1 className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.1] text-foreground">Let&apos;s Work Together</h1>
            <p className="mx-auto mt-4 max-w-[600px] text-lg text-muted">
              Have a project in mind? We&apos;d love to hear about it. Let&apos;s create something great.
            </p>
          </div>
        </Container>
      </section>

      {/* Content */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 items-start gap-12 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
            {/* Info panel */}
            <div>
              <h2 className="mb-3 text-2xl font-extrabold text-foreground">Get in Touch</h2>
              <p className="mb-8 leading-[1.8] text-muted">
                Whether you have a project idea, a question, or just want to say hello — our inbox is always open.
              </p>

              <div className="mb-8 flex flex-col gap-3.5">
                {activeInfo.length > 0 ? activeInfo.map(info => {
                  const Icon = info.icon;
                  const value = settings[info.key];
                  const href = info.hrefPrefix ? `${info.hrefPrefix}${value.replace(/\s/g, '')}` : null;
                  return (
                    <Card key={info.key} hover={false} className="flex items-center gap-4 p-5">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border-[1.5px] border-primary/25 bg-primary/10">
                        <Icon size={17} color="var(--primary-light)" />
                      </div>
                      <div>
                        <div className="mb-0.5 text-xs uppercase tracking-wider text-muted">{info.label}</div>
                        {href ? (
                          <a href={href} target={info.external ? '_blank' : undefined} rel="noopener noreferrer" className="text-[0.925rem] font-semibold text-foreground transition-colors hover:text-primary-light">
                            {value}
                          </a>
                        ) : (
                          <span className="text-[0.925rem] font-semibold text-foreground">{value}</span>
                        )}
                      </div>
                    </Card>
                  );
                }) : (
                  <p className="text-[0.875rem] text-muted">Contact details coming soon.</p>
                )}
              </div>

              {activeSocials.length > 0 && (
                <div>
                  <div className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">Find us on</div>
                  <div className="flex flex-wrap gap-2">
                    {activeSocials.map(s => {
                      const Icon = s.icon;
                      return (
                        <a
                          key={s.key}
                          href={settings[s.key]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-border bg-surface-2 px-3.5 py-1.5 text-[0.82rem] font-semibold text-muted transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white"
                        >
                          <Icon size={13} /> {s.label}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <ContactForm />
          </div>
        </Container>
      </Section>
    </div>
  );
}
