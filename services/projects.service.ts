import {
  collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, deleteField, doc,
  orderBy, query, where, serverTimestamp, type QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Project, ProjectInput } from '@/types/project';

const COLLECTION = 'projects';

export interface ListProjectsOptions {
  /** Firestore field to order by. Defaults to 'createdAt'. */
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  limit?: number;
  /** Admin views need drafts visible; public pages default to published only. */
  includeDrafts?: boolean;
}

/**
 * Featured projects first (by displayOrder, ascending), then the rest in their existing
 * (createdAt-desc) order. Deliberately an in-memory sort, not a Firestore `orderBy`: Firestore
 * excludes any document missing the ordered field from the result set entirely, which would
 * silently drop every legacy project (none of which have `displayOrder`) from every query.
 */
function sortByFeatured(projects: Project[]): Project[] {
  const featured = projects
    .filter(p => p.featured)
    .sort((a, b) => (a.displayOrder ?? Infinity) - (b.displayOrder ?? Infinity));
  const rest = projects.filter(p => !p.featured);
  return [...featured, ...rest];
}

export async function listProjects(options: ListProjectsOptions = {}): Promise<Project[]> {
  const { orderByField = 'createdAt', orderDirection = 'desc', limit, includeDrafts = false } = options;
  const constraints: QueryConstraint[] = [orderBy(orderByField, orderDirection)];

  const snap = await getDocs(query(collection(db, COLLECTION), ...constraints));
  let projects = snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));

  if (!includeDrafts) projects = projects.filter(p => p.status !== 'draft');

  projects = sortByFeatured(projects);
  if (limit) projects = projects.slice(0, limit);

  return projects;
}

export async function getProject(id: string): Promise<Project | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Project;
}

/**
 * Canonical PUBLIC lookup for /work/[slug]. Resolves strictly by the explicit `slug` field —
 * never by deriving one from `title`, and never by Firestore document ID (legacy ID URLs are
 * redirected to the slug before they reach a page; see next.config.ts and app/portfolio/[id]).
 * Draft projects resolve to null, exactly like a project that doesn't exist, so an unpublished
 * project can never render publicly just because its slug is known.
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const snap = await getDocs(query(collection(db, COLLECTION), where('slug', '==', slug)));
  if (snap.empty) return null;
  const project = { id: snap.docs[0].id, ...snap.docs[0].data() } as Project;
  return project.status === 'draft' ? null : project;
}

/** True if `slug` is already used by a different project. Excludes `excludeId` (the project
 * being edited) so saving a project's own unchanged slug never trips this check. */
export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const snap = await getDocs(query(collection(db, COLLECTION), where('slug', '==', slug)));
  return snap.docs.some(d => d.id !== excludeId);
}

/* Firestore rejects `undefined` field values. Optional fields (e.g. an emptied displayOrder) arrive
   as undefined, so drop them on create and turn them into deleteField() on update. */
function withoutUndefined<T extends object>(data: T): Partial<T> {
  return Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined)) as Partial<T>;
}

function undefinedToDelete<T extends object>(data: T): Record<string, unknown> {
  return Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v === undefined ? deleteField() : v]));
}

/** Next free position among FEATURED projects: 1 for the first, otherwise the highest existing
 * order + 1 (or the featured count, whichever is larger, so featured projects without a
 * displayOrder still count). Non-featured projects don't take part in the ordering. */
export async function getNextDisplayOrder(excludeId?: string): Promise<number> {
  const snap = await getDocs(query(collection(db, COLLECTION), where('featured', '==', true)));
  const docs = snap.docs.filter(d => d.id !== excludeId);
  const highest = docs.reduce((max, d) => {
    const n = d.data().displayOrder;
    return typeof n === 'number' && n > max ? n : max;
  }, 0);
  return Math.max(highest, docs.length) + 1;
}

export async function createProject(data: ProjectInput): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...withoutUndefined(data),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProject(id: string, data: ProjectInput): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...undefinedToDelete(data),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
