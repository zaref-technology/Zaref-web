import type { NavLink } from '@/constants/nav';

/** Safe route-active matching — exact match, or a real sub-path (`/work/`), never a naive
 * `startsWith` that would also match an unrelated route sharing the same prefix (e.g. a
 * hypothetical `/workshop` matching `/work`). */
export function isActiveRoute(pathname: string, path: string): boolean {
  return pathname === path || pathname.startsWith(`${path}/`);
}

function splitHash(href: string): [string, string | undefined] {
  const [path, hash] = href.split('#');
  return [path, hash];
}

/**
 * Whether a nav link should render as active, given the current pathname and URL hash. Handles
 * links that share a base path but target different hash anchors (e.g. "Services" at /services
 * and "Solutions" at /services#solutions) without ever double-highlighting: a hash-specific link
 * is active only when its hash matches exactly, and a plain path-only link yields whenever the
 * current hash belongs to a sibling link on the same path.
 */
export function isNavLinkActive(link: NavLink, allLinks: NavLink[], pathname: string, hash: string): boolean {
  if (link.activePath === null) return false;
  const target = link.activePath ?? link.href;
  const [targetPath, targetHash] = splitHash(target);

  if (targetHash) {
    return pathname === targetPath && hash === `#${targetHash}`;
  }

  const hashOwnedBySibling = allLinks.some(other => {
    if (other === link || other.activePath === null) return false;
    const [otherPath, otherHash] = splitHash(other.activePath ?? other.href);
    return !!otherHash && otherPath === targetPath && hash === `#${otherHash}`;
  });

  return isActiveRoute(pathname, targetPath) && !hashOwnedBySibling;
}
