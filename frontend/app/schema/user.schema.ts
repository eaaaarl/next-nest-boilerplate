import { z } from 'zod';

export const userSchema = z.object({
  studentID: z
    .string()
    .min(1, 'Student Id is required')
    .min(7, 'Student id must be at least 7 characters'),
  name: z.string().min(1, 'Name is required'),
  course: z.string().min(1, 'Course is required'),
});

export type userValues = z.infer<typeof userSchema>;
