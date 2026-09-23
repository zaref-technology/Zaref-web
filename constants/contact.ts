import { CAPABILITIES } from './capabilities';

/**
 * The Contact form stores whichever label is selected here directly as free text (see
 * services/messages.service.ts) — there's no separate machine-value layer to keep in sync, so
 * these labels double as the submitted/stored/admin-displayed values. Derived from the same
 * CAPABILITIES source of truth as Services/homepage, in the same order, so the form can never
 * drift from the approved six-capability architecture; "Development Partnership" and the
 * catch-all are Contact-specific and appended after.
 */
export const CONTACT_PROJECT_TYPES = [
  ...CAPABILITIES.map(c => c.title),
  'Development Partnership',
  'Not Sure / Something Else',
];

export const CONTACT_BUDGET_RANGES = [
  'Under $2,000',
  '$2,000 – $5,000',
  '$5,000 – $15,000',
  '$15,000+',
  'Not sure yet',
] as const;
