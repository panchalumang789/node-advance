import { z } from 'zod';

export interface USER {
  id: string;
  name: string;
  email: string;
  address: string;
  contact_no: string;
  password: string;
  role: USER_ROLES;
  created_at: Date;
  updated_at: Date;
}
export enum USER_ROLES {
  'ADMIN' = 'ADMIN',
  'INSTRUCTOR' = 'INSTRUCTOR',
  'STUDENT' = 'STUDENT',
}

export const getAllUsersSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  address: z.string(),
  contact_no: z.string(),
  password: z.string(),
  role: z.nativeEnum(USER_ROLES),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export const getUsersDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  address: z.string(),
  contact_no: z.string(),
  password: z.string(),
  role: z.nativeEnum(USER_ROLES),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  _count: z.string(),
  orders: z.array(
    z.object({
      orderItems: z.array(
        z.object({
          product: z.object({
            price: z.number(),
          }),
          quantity: z.number(),
        })
      ),
    })
  ),
});

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').default(''),
  email: z.string().min(1, 'Email is required').email().default(''),
  address: z.string().min(1, 'Address is required').default(''),
  contact_no: z
    .string()
    .min(1, 'Contact No is required')
    .min(10, 'Invalid Contact No')
    .max(10, 'Invalid Contact No')
    .default(''),
  password: z.string().min(1, 'Password is required').default(''),
  role: z.nativeEnum(USER_ROLES).default(USER_ROLES.STUDENT),
});

export type getAllUserData = z.infer<typeof createUserSchema>;
