import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().default('umang1@gmail.com'),
  password: z.string().default('123'),
});
