/** Joins class names, dropping falsy values. Deliberately not pulling in clsx/tailwind-merge for a codebase this size. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
