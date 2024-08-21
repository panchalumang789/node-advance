import 'fastify';
import { GetAllUserData } from '../schema/user';

declare module 'fastify' {
  export interface FastifyRequest {
    validatedData?: GetAllUserData;
    auth?: {
      user?: {
        email?: string;
      };
    };
  }
}
