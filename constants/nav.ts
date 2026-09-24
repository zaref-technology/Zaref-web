import { ROUTES } from './routes';

export interface NavLink {
  href: string;
  label: string;
  /** Path (optionally "path#hash") used for active-state matching. `null` opts a link out of
   * ever showing active. Omit to default to `href`. "Services" and "Solutions" share the
   * `/services` base path but target different hashes — `isNavLinkActive` (lib/nav.ts) resolves
   * which one should highlight from the current URL hash, so only one is ever active at once. */
  activePath?: string | null;
}

/** Primary site navigation. Contact isn't a nav item — the primary CTA ("Discuss Your
 * Project") covers that, the page itself still exists at /contact. */
export const NAV_LINKS: NavLink[] = [
  { href: ROUTES.services, label: 'Services', activePath: ROUTES.services },
  { href: ROUTES.solutions, label: 'Solutions', activePath: ROUTES.solutions },
  { href: ROUTES.work, label: 'Work', activePath: ROUTES.work },
  { href: ROUTES.company, label: 'Company', activePath: ROUTES.company },
];
