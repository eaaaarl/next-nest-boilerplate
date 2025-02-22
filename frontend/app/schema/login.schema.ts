import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(3, 'Username is required').max(255),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(255),
});

export type loginPayload = z.infer<typeof loginSchema>;
