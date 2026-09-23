export interface RevalidateTarget {
  path: string;
  /** 'layout' invalidates the layout and everything under it (use for site-wide data like settings). */
  type?: 'page' | 'layout';
}

/**
 * Tells the server to drop its cached HTML for the given paths so the next visit picks up
 * fresh data. Called from admin mutation handlers after a Firestore write — the admin panel
 * writes directly to Firestore from the browser, so this is the only way the public
 * (statically generated) pages find out something changed. Fire-and-forget: a failure here
 * should never block the admin UX, the site just falls back to the timed revalidate window.
 */
export async function triggerRevalidate(paths: RevalidateTarget[]): Promise<void> {
  try {
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paths }),
    });
  } catch (err) {
    console.error('Revalidation trigger failed:', err);
  }
}
