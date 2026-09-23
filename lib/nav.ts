/** Safe route-active matching — exact match, or a real sub-path (`/work/`), never a naive
 * `startsWith` that would also match an unrelated route sharing the same prefix (e.g. a
 * hypothetical `/workshop` matching `/work`). */
export function isActiveRoute(pathname: string, path: string): boolean {
  return pathname === path || pathname.startsWith(`${path}/`);
}
