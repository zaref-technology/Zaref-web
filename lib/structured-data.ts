import { SITE_URL, SITE_NAME } from '@/constants/site';
import { SOCIAL_PLATFORMS } from '@/constants/social';
import type { SiteSettings } from '@/types/settings';
import { getCapabilityHref, type Capability } from '@/constants/capabilities';

/** Stable entity identifiers — every other JSON-LD node references Zaref by these, so there is
 * exactly one Organization and one WebSite entity across the whole site. */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Only real, absolute https URLs from Site Settings; empty or malformed values are dropped. */
function validProfileUrls(settings: Partial<SiteSettings>): string[] {
  const urls: string[] = [];
  for (const platform of SOCIAL_PLATFORMS) {
    const raw = settings[platform.key]?.trim();
    if (!raw) continue;
    try {
      const url = new URL(raw);
      if (url.protocol === 'https:') urls.push(url.toString());
    } catch {
      /* invalid URL — ignored */
    }
  }
  return urls;
}

/**
 * The single site-wide Organization + WebSite graph. Deliberately limited to facts that exist:
 * name, canonical URL, logo, the approved public description, and the social profile URLs
 * currently configured in Site Settings. No address, contact point, founding date, size or
 * ratings — none of those are verified data.
 */
export function siteJsonLd(settings: Partial<SiteSettings>, description: string) {
  const sameAs = validProfileUrls(settings);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORGANIZATION_ID,
        name: SITE_NAME,
        url: SITE_URL,
        // Same approved mark as zaref-icon.png, at 180x180 (~27 KB vs ~1 MB); served by app/apple-icon.png.
        logo: `${SITE_URL}/apple-icon.png`,
        description,
        ...(sameAs.length > 0 ? { sameAs } : {}),
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        description,
        inLanguage: 'en',
        publisher: { '@id': ORGANIZATION_ID },
      },
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === '/' ? '' : item.path}`,
    })),
  };
}

type ServiceCapability = Pick<Capability, 'slug' | 'title' | 'longDescription' | 'pagePath'>;

/** A capability with a dedicated page is one entity identified by that page; the others by their
 * /services anchor. */
function serviceEntityId(c: ServiceCapability): string {
  return c.pagePath ? `${SITE_URL}${c.pagePath}#service` : `${SITE_URL}${getCapabilityHref(c)}`;
}

/** Full Service entity — name and description are the exact visible copy. No prices, ratings,
 * offers, availability or service areas (none are real data). */
function serviceNode(c: ServiceCapability) {
  return {
    '@type': 'Service',
    '@id': serviceEntityId(c),
    name: c.title,
    description: c.longDescription,
    url: `${SITE_URL}${getCapabilityHref(c)}`,
    provider: { '@id': ORGANIZATION_ID },
  };
}

/** Services overview graph. A capability with a dedicated page is only referenced here by its
 * `@id` (its page defines it), so there is never a second, conflicting entity for it. */
export function servicesJsonLd(capabilities: ServiceCapability[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': capabilities.map(c => (c.pagePath ? { '@id': serviceEntityId(c) } : serviceNode(c))),
  };
}

/** The Service entity for a capability's own dedicated page. */
export function serviceJsonLd(capability: ServiceCapability) {
  return { '@context': 'https://schema.org', ...serviceNode(capability) };
}

/** A case study stays a CreativeWork (screenshots + description of delivered work — not a
 * SoftwareApplication, which would require category/OS/offer data that doesn't exist). */
export function projectJsonLd(project: {
  /** Canonical public path, e.g. `/work/{slug}` — never a Firestore document ID. */
  path: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  keywords?: string[];
  /** Real last-modified timestamp of the project record, if available. */
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description || undefined,
    image: project.images?.[0] || undefined,
    genre: project.category || undefined,
    keywords: project.keywords && project.keywords.length > 0 ? project.keywords.join(', ') : undefined,
    url: `${SITE_URL}${project.path}`,
    mainEntityOfPage: `${SITE_URL}${project.path}`,
    inLanguage: 'en',
    dateModified: project.dateModified,
    creator: { '@id': ORGANIZATION_ID },
    publisher: { '@id': ORGANIZATION_ID },
    isPartOf: { '@id': WEBSITE_ID },
  };
}
