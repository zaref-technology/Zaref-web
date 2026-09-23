import { ROUTES } from './routes';

export interface NavLink {
  href: string;
  label: string;
  /** Path used for active-state matching. `null` opts a link out of ever showing active —
   * used by "Solutions", which shares the `/services` route with the "Services" link itself;
   * giving both an active state at once would be a confusing double-highlight, and hash-aware
   * scroll-spy would be brittle, so Services owns the active state on that route and Solutions
   * stays a plain navigation shortcut. Omit to default to `href`. */
  activePath?: string | null;
}

/** Primary site navigation. Contact isn't a nav item — the primary CTA ("Discuss Your
 * Project") covers that, the page itself still exists at /contact. */
export const NAV_LINKS: NavLink[] = [
  { href: ROUTES.services, label: 'Services', activePath: ROUTES.services },
  { href: ROUTES.solutions, label: 'Solutions', activePath: null },
  { href: ROUTES.work, label: 'Work', activePath: ROUTES.work },
  { href: ROUTES.company, label: 'Company', activePath: ROUTES.company },
];
