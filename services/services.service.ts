import {
  collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc,
  orderBy, query, limit as fsLimit, serverTimestamp, type QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Service, ServiceInput } from '@/types/service';

const COLLECTION = 'services';

export interface ListServicesOptions {
  limit?: number;
}

export async function listServices(options: ListServicesOptions = {}): Promise<Service[]> {
  const constraints: QueryConstraint[] = [orderBy('order', 'asc')];
  if (options.limit) constraints.push(fsLimit(options.limit));

  const snap = await getDocs(query(collection(db, COLLECTION), ...constraints));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Service));
}

export async function getService(id: string): Promise<Service | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Service;
}

export async function createService(data: ServiceInput): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    order: Number(data.order),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateService(id: string, data: ServiceInput): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    order: Number(data.order),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteService(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
