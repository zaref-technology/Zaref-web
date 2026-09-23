import {
  collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc,
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
 * Canonical public lookup for /work/[slug]. Resolves by the explicit `slug` field — never by
 * deriving one from `title` at request time, which would make URLs unstable. Falls back to
 * treating the param as a raw Firestore document ID only as a migration safety net, for the
 * rare case of a project that predates the slug field and hasn't been backfilled yet.
 */
export async function getProjectBySlug(slugOrId: string): Promise<Project | null> {
  const snap = await getDocs(query(collection(db, COLLECTION), where('slug', '==', slugOrId)));
  if (!snap.empty) return { id: snap.docs[0].id, ...snap.docs[0].data() } as Project;
  return getProject(slugOrId);
}

/** True if `slug` is already used by a different project. Excludes `excludeId` (the project
 * being edited) so saving a project's own unchanged slug never trips this check. */
export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const snap = await getDocs(query(collection(db, COLLECTION), where('slug', '==', slug)));
  return snap.docs.some(d => d.id !== excludeId);
}

export async function createProject(data: ProjectInput): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProject(id: string, data: ProjectInput): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
