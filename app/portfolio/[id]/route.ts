import { NextRequest, NextResponse } from 'next/server';
import { getProject } from '@/services/projects.service';
import { ROUTES } from '@/constants/routes';

/**
 * Legacy ID → slug redirect. Serves both:
 *   - old `/portfolio/{firestoreId}` links, and
 *   - `/work/{firestoreId}`, which next.config.ts rewrites here (Firestore auto-IDs are exactly
 *     20 alphanumeric characters, no hyphen) so an internal ID is never an indexable 200 page.
 * Redirects straight to the canonical `/work/{slug}` in ONE hop (never id -> id -> slug).
 *
 * Only a PUBLISHED project with a real slug is ever redirected. A draft, a missing project and a
 * project without a slug are all indistinguishable 404s, so nothing about an unpublished
 * project is revealed. (Redirecting a slug-less project to /work/{id} would also loop back
 * through the rewrite.)
 *
 * Deliberately a Route Handler, not a page.tsx calling permanentRedirect(): in this Next.js
 * version, permanentRedirect()/redirect() called from a streamed page render emits a client-side
 * <meta refresh> instead of a real top-level HTTP 3xx, which search engines don't treat as a
 * permanent redirect. A Route Handler returns a raw Response, so this is a genuine 308.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project || project.status === 'draft' || !project.slug) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const destination = new URL(`${ROUTES.work}/${project.slug}`, request.url);
  return NextResponse.redirect(destination, 308);
}
