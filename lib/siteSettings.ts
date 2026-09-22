import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface SiteSettings {
  // Contact info
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  location: string;
  // Social links
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  facebook: string;
  youtube: string;
  // Branding
  siteName: string;
  tagline: string;
}

const DEFAULTS: SiteSettings = {
  email:     '',
  phone:     '',
  whatsapp:  '',
  address:   '',
  location:  'Remote — Worldwide',
  github:    '',
  linkedin:  '',
  twitter:   '',
  instagram: '',
  facebook:  '',
  youtube:   '',
  siteName:  'Zaref',
  tagline:   'Building digital experiences that matter.',
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
