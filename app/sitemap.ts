import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/constants/site';
import { ROUTES, getProjectUrl } from '@/constants/routes';
import { listProjects } from '@/services/projects.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [ROUTES.home, ROUTES.services, ROUTES.work, ROUTES.company, ROUTES.contact];

  // No `lastModified` for static pages: there is no reliable modification timestamp for them,
  // and publishing the current request time would advertise freshness that doesn't exist.
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route === ROUTES.home ? '' : route}`,
  }));

  // Published, slugged projects only — drafts and any project not yet backfilled with a slug
  // are never publicly indexable, and Firestore IDs never appear in the sitemap. The date is the
  // project record's real last-update time; omitted when none is stored.
  const projects = await listProjects();
  const projectEntries: MetadataRoute.Sitemap = projects
    .filter((project) => !!project.slug)
    .map((project) => {
      const modified = project.updatedAt?.toDate() ?? project.createdAt?.toDate();
      return {
        url: `${SITE_URL}${getProjectUrl(project)}`,
        ...(modified ? { lastModified: modified } : {}),
      };
    });

  return [...staticEntries, ...projectEntries];
}
