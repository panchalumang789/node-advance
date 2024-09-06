import 'fastify';
import { RedisClientType } from 'redis';

import { getAllUserData } from '../schema/user';
import { getAllOrderData } from '../schema/orders';
import { getAllProductData } from '../schema/products';
import { getAllPaymentData } from '../schema/payments';
import { getAllOrderItemData } from '../schema/orderItems';

declare module 'fastify' {
  export interface FastifyInstance {
    redisServer: RedisClientType;
  }
  export interface FastifyRequest {
    validatedUserData?: getAllUserData;
    validatedProductData?: getAllProductData;
    validatedOrderData?: getAllOrderData;
    validatedOrderItemData?: getAllOrderItemData;
    validatedPaymentData?: getAllPaymentData;
    auth?: {
      user: {
        id: string;
        email: string;
        role: string;
      };
    };
  }
}
