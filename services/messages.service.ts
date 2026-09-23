import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc,
  orderBy, query, limit as fsLimit, where, serverTimestamp, type QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Message, MessageInput } from '@/types/message';

const COLLECTION = 'messages';

export interface ListMessagesOptions {
  limit?: number;
  unreadOnly?: boolean;
}

export async function listMessages(options: ListMessagesOptions = {}): Promise<Message[]> {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
  if (options.unreadOnly) constraints.push(where('read', '==', false));
  if (options.limit) constraints.push(fsLimit(options.limit));

  const snap = await getDocs(query(collection(db, COLLECTION), ...constraints));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Message));
}

export async function countMessages(unreadOnly = false): Promise<number> {
  const constraints: QueryConstraint[] = unreadOnly ? [where('read', '==', false)] : [];
  const snap = await getDocs(query(collection(db, COLLECTION), ...constraints));
  return snap.size;
}

export async function markMessageRead(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { read: true });
}

export async function deleteMessage(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

/** Submits a public contact-form message. Computes a subject line from the project type + company. */
export async function submitMessage(data: MessageInput): Promise<void> {
  const subject = `${data.projectType ?? 'General Inquiry'}${data.company ? ` — ${data.company}` : ''}`;
  await addDoc(collection(db, COLLECTION), {
    ...data,
    subject,
    read: false,
    createdAt: serverTimestamp(),
  });
}
