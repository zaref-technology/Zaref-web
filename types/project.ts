import type { Timestamp } from 'firebase/firestore';

export interface ProjectFeature {
  title: string;
  description: string;
  order: number;
}

export interface GalleryItem {
  url: string;
  alt?: string;
  caption?: string;
  order: number;
}

export type ProjectStatus = 'draft' | 'published';

export interface Project {
  id: string;
  title: string;
  /** Public routing identity — /work/{slug}. Optional only for backward compatibility with
   * projects created before this field existed; every project should have one in normal
   * operation. Auto-generated from `title` at creation, then stable — editing `title` later
   * must never silently change a published slug. The Firestore document `id` above remains
   * the internal database identity and is never derived from or coupled to this field. */
  slug?: string;
  /** Short teaser used on cards/hero. Falls back to the first line of `description` if unset. */
  shortDescription?: string;
  status?: ProjectStatus;
  /** Manually curated for homepage/featured presentation. Sorted in-memory, never via Firestore
   * orderBy, so legacy documents without this field are never silently excluded from a query. */
  featured?: boolean;
  displayOrder?: number;

  // ── Classification ──────────────────────────────────────────
  /** Product/platform type (e.g. "Web Application", "Mobile Application", "Business Software"). */
  category: string;
  /** Zaref capability slugs, referencing constants/capabilities.ts — the same source of truth
   * used by the homepage and Services page. Explicit, admin-selected — never inferred. */
  capabilityIds?: string[];
  solutionType?: string;
  industry?: string;

  // ── Client / context ────────────────────────────────────────
  clientName?: string;
  projectYear?: string;

  // ── Case study content ──────────────────────────────────────
  /** Long-form overview — also the legacy field, still the Overview section's source. */
  description: string;
  challenge?: string;
  /** Canonical "Solution" field. `approach` (below) is the deprecated legacy name for this. */
  solution?: string;
  /** @deprecated legacy name for `solution`, read-only fallback for old records. */
  approach?: string;
  /** @deprecated no equivalent in the target model; legacy display-only. */
  role?: string;
  outcome?: string;
  features?: ProjectFeature[];

  // ── Engineering ──────────────────────────────────────────────
  /** @deprecated legacy comma-separated tech-stack string. New records use `technologies`. */
  tags: string;
  technologies?: string[];
  platforms?: string[];
  integrations?: string[];

  color: string;

  // ── Media ────────────────────────────────────────────────────
  /** Legacy flat image list; images[0] is the cover. Still populated for every project. */
  images: string[];
  /** Structured gallery with alt/caption/order. Falls back to `images` when absent. */
  gallery?: GalleryItem[];

  // ── Links ────────────────────────────────────────────────────
  projectUrl: string;
  githubUrl: string;
  youtubeUrl?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;

  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

/** Shape accepted when creating/updating a project (no id, no server timestamps). */
export type ProjectInput = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;
