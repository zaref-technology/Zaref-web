import { NextRequest, NextResponse } from 'next/server';
import { getProject } from '@/services/projects.service';
import { ROUTES } from '@/constants/routes';

/**
 * Legacy route — kept only to redirect old `/portfolio/{firestoreId}` links (already indexed,
 * already shared) directly to the canonical `/work/{slug}` URL. Not linked from anywhere in
 * the current site; reachable only via old bookmarks/search results/backlinks. Resolves the
 * slug dynamically via the project service rather than a hardcoded id->slug map, so it stays
 * correct automatically as projects are added/edited — no redirect chain (id -> slug directly,
 * never id -> id -> slug).
 *
 * Deliberately a Route Handler, not a page.tsx calling permanentRedirect(): in this Next.js
 * version, permanentRedirect()/redirect() called from a streamed page render emits a client-side
 * <meta refresh> instead of a real top-level HTTP 3xx (see permanentRedirect docs — "when used
 * in a streaming context"). That's invisible to search engines and violates the "real 308"
 * requirement for preserving indexed link equity. A Route Handler returns a raw Response, fully
 * outside the React streaming pipeline, so NextResponse.redirect produces a genuine HTTP redirect.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return new NextResponse('Not Found', { status: 404 });

  const destination = new URL(`${ROUTES.work}/${project.slug || project.id}`, request.url);
  return NextResponse.redirect(destination, 308);
}
