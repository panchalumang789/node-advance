import { z } from 'zod';
import bcrypt from 'bcrypt';
import { FastifyReply, FastifyRequest } from 'fastify';

import db from '../config/db';
import { USER_ROLES } from '../schema/user';

export class UserController {
  getAllUsers = async (request: FastifyRequest, reply: FastifyReply) => {
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

  getUserById = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;
      const user = await db('users').select('*').where({ id }).first();
      if (!user) {
        throw request.server.httpErrors.badRequest('User not found');
      }
      if (
        user.role.toString() === USER_ROLES.Admin.toString() &&
        request.auth?.user.role !== USER_ROLES.Admin.toString()
      ) {
        throw request.server.httpErrors.badRequest('Unauthorized access');
      }
      return reply.code(200).send({ user });
    } catch (error) {
      if (error instanceof Error) {
        return reply.code(500).send({ message: error.message });
      } else {
        return reply.code(404).send({ message: 'User not found' });
      }
    }
  };

  updateUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.validatedUserData) {
        return reply.code(500).send({ message: 'User data not found' });
      }
      const hashedPassword = await bcrypt.hash(request.validatedUserData.password, 10);

      const { id } = request.params as FastifyRequest<{ Params: { id: string } }>;

      const existingUser = await db('users').select('id', 'role').where({ id }).first();
      if (!existingUser) {
        throw request.server.httpErrors.badRequest('User not found');
      }
      if (
        existingUser.role + '' !== request.validatedUserData.role + '' &&
        request.auth?.user.role !== USER_ROLES.Admin.toString()
      ) {
        throw request.server.httpErrors.badRequest('Cannot change the role');
      }
      if (
        existingUser.id !== request.auth?.user.id &&
        request.auth?.user.role !== USER_ROLES.Admin.toString()
      ) {
        throw request.server.httpErrors.badRequest('Unauthorized access');
      }

      const [user] = await db('users')
        .update({ ...request.validatedUserData, password: hashedPassword })
        .where({ id })
        .returning('*');
      if (!user) {
        throw request.server.httpErrors.badRequest('User update failed');
      }
      return reply.code(200).send({ user });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ message: error.issues[0].message });
      } else if (error instanceof Error) {
        return reply.code(500).send({ message: error.message });
      }
    }
  };

  deleteUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as FastifyRequest<{ Params: { id: string } }>;

      const existingUser = await db('users').select('id').where({ id }).first();
      if (!existingUser) {
        throw request.server.httpErrors.badRequest('User not found');
      }
      if (
        existingUser.id !== request.auth?.user.id &&
        request.auth?.user.role !== USER_ROLES.Admin.toString()
      ) {
        throw request.server.httpErrors.badRequest('Unauthorized access');
      }

      const user = await db('users').delete().where({ id });
      if (!user) throw request.server.httpErrors.badRequest('User delete failed');
      return reply.code(200).send({ message: `${user} user deleted` });
    } catch (error) {
      if (error instanceof Error) {
        return reply.code(500).send({ message: error.message });
      }
    }
  };
}
