/**
 * Deterministic slug generator — no dependency needed for this.
 * "VR CRM – Solar Business CRM Software" -> "vr-crm-solar-business-crm-software"
 */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // any run of non-alphanumeric -> single hyphen
    .replace(/^-+|-+$/g, ''); // trim leading/trailing hyphens
}
