import 'fastify';
import { getAllUserData } from '../schema/user';
import { getAllProductData } from '../schema/products';
import { RedisClientType } from 'redis';

declare module 'fastify' {
  export interface FastifyInstance {
    redisServer: RedisClientType;
  }
  export interface FastifyRequest {
    validatedUserData?: getAllUserData;
    validatedProductData?: getAllProductData;
    validatedOrderData?: getAllProductData;
    validatedPaymentData?: getAllProductData;
    auth?: {
      user: {
        id: string;
        email: string;
        role: string;
      };
    };
  }
}
