import type { Timestamp } from 'firebase/firestore';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  /** Kept for backward compatibility and Admin use — not displayed publicly. */
  rating: number;
  avatar: string; // Cloudinary URL or empty string (no placeholder is generated)
  order: number;
  /** Optional explicit relationship to a Firestore project document ID. Never inferred. */
  projectId?: string;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

export type TestimonialInput = Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>;

/** A testimonial plus its resolved related case study, when a valid public one exists. */
export type TestimonialWithProject = Testimonial & { project?: { title: string; url: string } };
