import type { Timestamp } from 'firebase/firestore';

export interface Message {
  id: string;
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  budget?: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Timestamp | null;
}

/** Shape submitted from the public contact form. */
export type MessageInput = {
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  budget?: string;
  message: string;
};
