import type { Project } from '@/types/project';

/** Canonical public route paths — the single source of truth for top-level URLs. Header and
 * Footer intentionally stay as separate arrays (different structure/purpose), but both should
 * reference these paths rather than re-typing string literals. */
export const ROUTES = {
  home: '/',
  services: '/services',
  solutions: '/services#solutions',
  work: '/work',
  company: '/company',
  contact: '/contact',
  testimonials: '/testimonials',
} as const;

/** Canonical project URL. Falls back to the Firestore document ID only for a project that
 * hasn't been backfilled with a slug yet — `getProjectBySlug` resolves that case too, so this
 * never produces a dead link, but every project should have a real slug in normal operation. */
export function getProjectUrl(project: Pick<Project, 'id' | 'slug'>): string {
  return `${ROUTES.work}/${project.slug || project.id}`;
}
