import { z } from 'zod';
import { getAllProductsSchema } from './products';

export interface ORDERITEM {
  id: string;
  length: number;
  width: number;
  quantity: number;
  order_id: string;
  product_id: string;
  created_at: Date;
  updated_at: Date;
}

export const getAllOrderItemsSchema = z.object({
  id: z.string(),
  length: z.number(),
  width: z.number(),
  quantity: z.number(),
  order_id: z.string().uuid('Invalid order id'),
  product_id: z.string().uuid('Invalid product id'),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export const getOrderItemValuesSchema = z.object({
  id: z.string(),
  length: z.number(),
  width: z.number(),
  quantity: z.number(),
  order_id: z.string().uuid('Invalid order id'),
  product_id: z.string().uuid('Invalid product id'),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  products: getAllProductsSchema,
});

export const createOrderItemSchema = z.object({
  length: z.number().min(1, 'Length is required'),
  width: z.number().min(1, 'Width is required'),
  quantity: z.number().min(1, 'Quantity is required'),
  order_id: z.string().uuid('Invalid order id'),
  product_id: z.string().uuid('Invalid product id'),
});

export type getAllOrderItemData = z.infer<typeof createOrderItemSchema>;
