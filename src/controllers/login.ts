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

      const token = request.server.jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        { expiresIn: 3600 }
      );
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
      if (request.validatedData) {
        const hashedPassword = await bcrypt.hash(request.validatedData.password, 10);

        const [user] = await db('users')
          .insert({ ...request.validatedData, password: hashedPassword })
          .returning('*');

        if (!user) {
          throw request.server.httpErrors.badRequest('User creation failed');
        }
        return reply.code(200).send({ user });
      } else return reply.code(500).send({ message: 'User data not found' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ message: error.issues[0].message });
      } else if (error instanceof Error) {
        return reply.code(500).send({ message: error.message });
      }
    }
  };
}
