import { getAuth } from 'firebase/auth';
import app from './firebase';

/**
 * Split out from lib/firebase.ts on purpose: only admin code needs Firebase Auth, but
 * `getAuth()` runs eagerly at module load, so anything that imports it pulls the whole
 * firebase/auth SDK into its bundle. Keeping this in its own module means the public site's
 * client bundles (e.g. the contact form) never pay for auth code they don't use.
 */
export const auth = getAuth(app);
