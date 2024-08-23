import 'fastify';
import { GetAllUserData } from '../schema/user';

declare module 'fastify' {
  export interface FastifyRequest {
    validatedData?: GetAllUserData;
    auth?: {
      user: {
        id: string;
        email: string;
        role: string;
      };
    };
  }
}
