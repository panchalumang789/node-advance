import { z } from "zod";

export const createUserSchema = z.object({
    email: z.string().min(1, 'First name is required').email("Invalid email"),
    password: z.string().min(1, 'First name is required'),
});