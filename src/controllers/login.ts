import { z } from 'zod';
import bcrypt from 'bcrypt';
import { FastifyReply, FastifyRequest } from 'fastify';

import db from '../config/db';
import { loginSchema } from '../schema/login';

export class LoginController {
  login = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, password } = request.body as z.infer<typeof loginSchema>;

      const user = await db('users').select('*').where({ email }).first();
      if (!user) {
        throw request.server.httpErrors.badRequest('User not found');
      }

      const decryptedPassword = await bcrypt.compare(password, user.password);
      if (!decryptedPassword) return reply.code(401).send({ message: 'Invalid email or password' });

      const token = request.server.jwt.sign({ name: user.name, email: user.email });
      reply.header('Authorization', `Bearer ${token}`);

      return reply.code(200).send({ token });
    } catch (error) {
      if (error instanceof Error && error.name === 'NoSuchKey') {
        throw request.server.httpErrors.notFound('Users not found');
      }
      throw error;
    }
  };

  register = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const users = await db('users').select('*');
      if (!users) {
        throw request.server.httpErrors.badRequest('Users not found');
      }
      return reply.code(200).send({ users });
    } catch (error) {
      if (error instanceof Error && error.name === 'NoSuchKey') {
        throw request.server.httpErrors.notFound('Users not found');
      }
      throw error;
    }
  };
}
