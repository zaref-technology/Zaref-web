import { cache } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SiteSettings } from '@/types/settings';

const DEFAULTS: SiteSettings = {
  email: '',
  phone: '',
  whatsapp: '',
  address: '',
  // Deliberately empty: when no location is stored we omit it rather than invent geographic reach.
  location: '',
  github: '',
  linkedin: '',
  twitter: '',
  instagram: '',
  facebook: '',
  youtube: '',
  siteName: 'Zaref',
  tagline: 'Software built for real business.',
};

const REF = () => doc(db, 'settings', 'site');

// cache(): the layout (structured data), Footer and pages all read settings during one render —
// this collapses them into a single Firestore read per request.
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const snap = await getDoc(REF());
    if (!snap.exists()) return DEFAULTS;
    return { ...DEFAULTS, ...snap.data() } as SiteSettings;
  } catch {
    return DEFAULTS;
  }
});

export async function saveSiteSettings(data: SiteSettings): Promise<void> {
  await setDoc(REF(), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}
