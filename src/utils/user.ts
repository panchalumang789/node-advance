import { z } from "zod";

export const getAllUsersSchema = z.object({
    id: z.string().min(1, 'First name is required'),
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'First name is required'),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
})

export const createUserSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
});

export type GetAllUserData = z.infer<typeof createUserSchema>;
