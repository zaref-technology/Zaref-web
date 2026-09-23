import {
  collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc,
  orderBy, query, limit as fsLimit, serverTimestamp, type QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Testimonial, TestimonialInput } from '@/types/testimonial';

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

export async function getTestimonial(id: string): Promise<Testimonial | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Testimonial;
}

export async function createTestimonial(data: TestimonialInput): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    rating: Number(data.rating),
    order: Number(data.order),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateTestimonial(id: string, data: TestimonialInput): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    rating: Number(data.rating),
    order: Number(data.order),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTestimonial(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
