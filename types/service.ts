import type { Timestamp } from 'firebase/firestore';

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  color: string;
  order: number;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

export type ServiceInput = Omit<Service, 'id' | 'createdAt' | 'updatedAt'>;
