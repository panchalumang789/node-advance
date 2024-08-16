import 'fastify';
import { GetAllUserData } from '../utils/user';

declare module 'fastify' {
    export interface FastifyRequest {
        validatedData?: GetAllUserData
    }
}
