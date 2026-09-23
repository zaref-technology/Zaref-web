import type { Timestamp } from 'firebase/firestore';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  avatar: string; // Cloudinary URL or empty string (falls back to initials)
  order: number;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

export type TestimonialInput = Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>;
