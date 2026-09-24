import {
  collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, deleteField,
  orderBy, query, where, limit as fsLimit, serverTimestamp, type QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getProjectUrl } from '@/constants/routes';
import { listProjects } from './projects.service';
import type { Testimonial, TestimonialInput, TestimonialWithProject } from '@/types/testimonial';

const COLLECTION = 'testimonials';

export interface ListTestimonialsOptions {
  limit?: number;
}

export async function listTestimonials(options: ListTestimonialsOptions = {}): Promise<Testimonial[]> {
  const constraints: QueryConstraint[] = [orderBy('order', 'asc')];
  if (options.limit) constraints.push(fsLimit(options.limit));

  const snap = await getDocs(query(collection(db, COLLECTION), ...constraints));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial));
}

/**
 * Attaches each testimonial's related case study — only through the explicit `projectId`
 * relationship, never by matching names/text. One projects query total (skipped entirely when
 * no testimonial has a projectId). A missing, draft or slug-less project simply yields no link.
 */
export async function withRelatedProjects(testimonials: Testimonial[]): Promise<TestimonialWithProject[]> {
  if (!testimonials.some(t => t.projectId)) return testimonials;

  const projects = await listProjects();
  const byId = new Map(projects.map(p => [p.id, p]));

  return testimonials.map(t => {
    const project = t.projectId ? byId.get(t.projectId) : undefined;
    if (!project || !project.slug) return t;
    return { ...t, project: { title: project.title, url: getProjectUrl(project) } };
  });
}

/** Testimonials explicitly linked to a project via `projectId` (equality only — no heuristics). */
export async function listTestimonialsForProject(projectId: string): Promise<Testimonial[]> {
  const snap = await getDocs(query(collection(db, COLLECTION), where('projectId', '==', projectId)));
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() } as Testimonial))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getTestimonial(id: string): Promise<Testimonial | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Testimonial;
}

/** `projectId` is optional: an empty value is never written (create) or is removed (update). */
function toPayload(data: TestimonialInput) {
  const { projectId, ...rest } = data;
  return {
    ...rest,
    rating: Number(data.rating),
    order: Number(data.order),
    ...(projectId ? { projectId } : {}),
  };
}

export async function createTestimonial(data: TestimonialInput): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...toPayload(data),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateTestimonial(id: string, data: TestimonialInput): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...toPayload(data),
    ...(data.projectId ? {} : { projectId: deleteField() }),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTestimonial(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
