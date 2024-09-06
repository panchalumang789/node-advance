import { z } from 'zod';

export enum PaymentType {
  'CASH' = 'CASH',
  'ONLINE' = 'ONLINE',
  'CHEQUE' = 'CHEQUE',
}

export interface PAYMENT {
  id: string;
  amount: number;
  paymentType: PaymentType;
  order_id: string;
  created_at: Date;
  updated_at: Date;
}

export const getAllPaymentsSchema = z.object({
  id: z.string(),
  amount: z.number(),
  paymentType: z.nativeEnum(PaymentType),
  order_id: z.string().uuid('Invalid order id'),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export const createPaymentSchema = z.object({
  amount: z.number().default(0),
  paymentType: z.nativeEnum(PaymentType).default(PaymentType.CASH),
  order_id: z.string().uuid('Invalid order id'),
});

export type getAllPaymentData = z.infer<typeof createPaymentSchema>;
