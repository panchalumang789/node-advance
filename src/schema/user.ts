import { z } from "zod";

export const getAllUsersSchema = z.object({
    id: z.string().min(1, 'First name is required'),
    name: z.string().min(1, 'First name is required'),
    email: z.string().min(1, 'First name is required').email("Invalid email"),
    password: z.string().min(1, 'First name is required'),
    role: z.string().optional(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
})

export const createUserSchema = z.object({
    name: z.string().min(1, 'First name is required'),
    email: z.string().min(1, 'Last name is required').email(),
    password: z.string().min(1, 'Last name is required'),
    role: z.string().optional(),
});

export type GetAllUserData = z.infer<typeof createUserSchema>;
