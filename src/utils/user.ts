import { z } from "zod";
import { FastifyRequest } from "fastify";

export const userSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
});

export type UserData = z.infer<typeof userSchema>;

export interface ValidationDataRequest extends FastifyRequest {
    validatedData?: UserData;
}
