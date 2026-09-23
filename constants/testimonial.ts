/** Fallback avatar gradients, cycled by index, for testimonials without an uploaded photo. */
export const TESTIMONIAL_AVATAR_GRADIENTS: string[] = [
  'linear-gradient(135deg, #2563eb, #7c3aed)',
  'linear-gradient(135deg, #059669, #0891b2)',
  'linear-gradient(135deg, #d97706, #ea580c)',
  'linear-gradient(135deg, #db2777, #7c3aed)',
];

export function initialsFromName(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}
