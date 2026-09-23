import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SiteSettings } from '@/types/settings';

const DEFAULTS: SiteSettings = {
  email: '',
  phone: '',
  whatsapp: '',
  address: '',
  location: 'Remote — Worldwide',
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

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const snap = await getDoc(REF());
    if (!snap.exists()) return DEFAULTS;
    return { ...DEFAULTS, ...snap.data() } as SiteSettings;
  } catch {
    return DEFAULTS;
  }
}

export async function saveSiteSettings(data: SiteSettings): Promise<void> {
  await setDoc(REF(), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}
