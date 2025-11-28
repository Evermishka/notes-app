import { Timestamp } from 'firebase/firestore';
import { z } from 'zod';

const isoTimestamp = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: 'Ожидается строка в формате ISO 8601.',
  });

const timestampLike = z.union([isoTimestamp, z.instanceof(Date), z.instanceof(Timestamp)]);

export const FirestoreNoteSchema = z.object({
  userId: z.string().min(1),
  title: z.string(),
  content: z.string(),
  createdAt: timestampLike,
  updatedAt: timestampLike,
});

export type FirestoreNote = z.infer<typeof FirestoreNoteSchema>;
