export const SITE_URL = 'https://www.zaref.in';
/** Zaref is the master brand — avoid appending "Technology" throughout the site. */
export const SITE_NAME = 'Zaref';

/**
 * Next.js replaces a segment's entire `openGraph`/`twitter` object when a page declares its
 * own (it does not deep-merge with the parent layout's), so every page that sets its own
 * openGraph metadata must re-declare `images` or the OG image silently disappears for that page.
 */
export const DEFAULT_OG_IMAGES = ['/opengraph-image'];
