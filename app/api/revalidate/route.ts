import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

interface RevalidateTarget {
  path: string;
  type?: 'page' | 'layout';
}

/**
 * On-demand ISR trigger, called by the admin panel right after a Firestore write.
 * Public pages are statically generated (see the `revalidate` export on each page for the
 * timed fallback); this lets an edit go live immediately instead of waiting for that window.
 *
 * Optional lightweight gate: set REVALIDATE_SECRET to require a matching
 * `x-revalidate-secret` header. Left unset by default since this endpoint can only ever
 * invalidate cached HTML for public routes — worst case is a wasted rebuild, not a data leak.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (secret && request.headers.get('x-revalidate-secret') !== secret) {
    return NextResponse.json({ revalidated: false, message: 'Invalid secret' }, { status: 401 });
  }

  let paths: RevalidateTarget[];
  try {
    const body = await request.json();
    paths = body.paths;
  } catch {
    return NextResponse.json({ revalidated: false, message: 'Invalid JSON body' }, { status: 400 });
  }

  if (!Array.isArray(paths) || paths.length === 0) {
    return NextResponse.json({ revalidated: false, message: 'No paths provided' }, { status: 400 });
  }

  for (const { path, type } of paths) {
    if (typeof path === 'string') revalidatePath(path, type);
  }

  return NextResponse.json({ revalidated: true, paths });
}
