import { z } from 'zod';

const isoTimestamp = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: 'Ожидается строка в формате ISO 8601.',
  });

export const UserSchema = z.object({
  id: z.string().min(1),
  email: z.string(),
  username: z.string().min(1),
  createdAt: isoTimestamp,
});

export type User = z.infer<typeof UserSchema>;
