import { z } from 'zod';

export const getAllUsersSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  role: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email(),
  password: z.string().min(1, 'Password is required'),
  role: z.string().optional(),
});

export type GetAllUserData = z.infer<typeof createUserSchema>;
