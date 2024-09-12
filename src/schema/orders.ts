import { z } from 'zod';
import { getAllUsersSchema } from './user';
import { getAllPaymentsSchema } from './payments';
import { getAllProductsSchema } from './products';
import { getAllOrderItemsSchema } from './orderItems';

export enum PaymentStatus {
  'PENDING' = 'PENDING',
  'PAID' = 'PAID',
}
export interface ORDER {
  id: string;
  paymentStatus: PaymentStatus;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export const getAllOrdersSchema = z.object({
  id: z.string(),
  paymentStatus: z.nativeEnum(PaymentStatus),
  user_id: z.string().uuid('Invalid user id'),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export const getOrderValueSchema = z.object({
  id: z.string(),
  paymentStatus: z.nativeEnum(PaymentStatus),
  user_id: z.string().uuid('Invalid user id'),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  user: getAllUsersSchema,
  payments: z.union([z.array(getAllPaymentsSchema), z.array(z.null())]),
  orderItems: z.union([
    z.array(getAllOrderItemsSchema.extend({ product: getAllProductsSchema })),
    z.array(z.null()),
  ]),
});

export const createOrderSchema = z.object({
  paymentStatus: z.nativeEnum(PaymentStatus).default(PaymentStatus.PENDING),
  user_id: z.string().uuid('Invalid user id'),
});

export type getAllOrderData = z.infer<typeof createOrderSchema>;
