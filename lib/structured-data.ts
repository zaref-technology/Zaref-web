import { SITE_URL } from '@/constants/site';

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function projectJsonLd(project: {
  /** Canonical public path, e.g. `/work/{slug}` — never a Firestore document ID. */
  path: string;
  title: string;
  description: string;
  images: string[];
  category: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description || undefined,
    image: project.images?.[0] || undefined,
    genre: project.category || undefined,
    url: `${SITE_URL}${project.path}`,
    creator: {
      '@type': 'Organization',
      name: 'Zaref',
      url: SITE_URL,
    },
  };
}
