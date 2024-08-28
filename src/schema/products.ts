import { z } from 'zod';

export interface PRODUCT {
  id: string;
  name: string;
  imagePath: string;
  price: number;
  created_at: Date;
  updated_at: Date;
}

export const getAllProductsSchema = z.object({
  id: z.string(),
  name: z.string(),
  imagePath: z.string(),
  price: z.number(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export const createProductSchema = z.object({
  name: z.string().default(''),
  imagePath: z.string().default(''),
  price: z.number().default(0),
});

export type getAllProductData = z.infer<typeof createProductSchema>;
