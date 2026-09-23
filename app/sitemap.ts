import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/constants/site';
import { ROUTES, getProjectUrl } from '@/constants/routes';
import { listProjects } from '@/services/projects.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [ROUTES.home, ROUTES.services, ROUTES.work, ROUTES.company, ROUTES.contact, ROUTES.testimonials];
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route === ROUTES.home ? '' : route}`,
    lastModified: now,
  }));

  // Published, slugged projects only — drafts and any project not yet backfilled with a slug
  // are never publicly indexable, and Firestore IDs never appear in the sitemap.
  const projects = await listProjects();
  const projectEntries: MetadataRoute.Sitemap = projects
    .filter((project) => !!project.slug)
    .map((project) => ({
      url: `${SITE_URL}${getProjectUrl(project)}`,
      lastModified: project.updatedAt?.toDate() ?? project.createdAt?.toDate() ?? now,
    }));

  return [...staticEntries, ...projectEntries];
}
