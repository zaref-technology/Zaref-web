import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

interface RevalidateTarget {
  path: string;
  type?: 'page' | 'layout';
}

const MAX_PATHS = 20;

/**
 * Who may trigger revalidation. Fails CLOSED — no configuration means no access, never a public
 * endpoint:
 *  1. A signed-in admin: the admin panel sends its Firebase ID token (`Authorization: Bearer`),
 *     which is verified against Firebase itself (Identity Toolkit `accounts:lookup`) — the same
 *     Firebase Auth the admin panel already uses, no second auth system.
 *  2. Optionally, a server-to-server caller presenting `x-revalidate-secret` matching
 *     REVALIDATE_SECRET (only honoured when that variable is set).
 */
async function isAuthorized(request: NextRequest): Promise<boolean> {
  const secret = process.env.REVALIDATE_SECRET;
  if (secret && request.headers.get('x-revalidate-secret') === secret) return true;

  const header = request.headers.get('authorization') ?? '';
  const idToken = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!idToken || !apiKey) return false;

  try {
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
      cache: 'no-store',
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Array.isArray(data.users) && data.users.length > 0;
  } catch {
    return false;
  }
}

/**
 * On-demand ISR trigger, called by the admin panel right after a Firestore write.
 * Public pages are statically generated (see the `revalidate` export on each page for the
 * timed fallback); this lets an edit go live immediately instead of waiting for that window.
 */
export async function POST(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ revalidated: false, message: 'Unauthorized' }, { status: 401 });
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

  const valid = paths
    .filter(p => p && typeof p.path === 'string' && p.path.startsWith('/'))
    .slice(0, MAX_PATHS);
  for (const { path, type } of valid) revalidatePath(path, type);

  return NextResponse.json({ revalidated: true, paths: valid });
}
