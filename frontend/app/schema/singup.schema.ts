import { z } from 'zod';

export const signUpSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  name: z.string().min(1, 'Name is required'),
  email: z
    .string()
    .min(1, 'Username is required')
    .email({ message: 'Enter a valid email address.' }),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export type signUpValues = z.infer<typeof signUpSchema>;
