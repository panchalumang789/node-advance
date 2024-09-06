import { z } from 'zod';

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

export const createOrderSchema = z.object({
  paymentStatus: z.nativeEnum(PaymentStatus).default(PaymentStatus.PENDING),
  user_id: z.string().uuid('Invalid user id'),
});

export type getAllOrderData = z.infer<typeof createOrderSchema>;
