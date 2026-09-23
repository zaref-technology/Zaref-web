import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/constants/site';

// No trailing slash on /admin: robots.txt matching is by prefix, so "/admin" also covers
// "/admin/..." as well as the bare /admin route.
const PRIVATE_PATHS = ['/admin', '/api/'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      // AI search discovery is wanted, so OAI-SearchBot (ChatGPT search) is stated explicitly.
      // A crawler-specific group replaces the `*` group for that crawler, so the private paths
      // are repeated. GPTBot (model-training crawler) is a separate policy decision that has not
      // been made — it deliberately has no rule and falls under the generic `*` group above.
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
