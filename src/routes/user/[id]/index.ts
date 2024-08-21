import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';

import { UserController } from '../../../controllers/users';
import { createUserSchema, getAllUsersSchema } from '../../../schema/user';
import { auth } from '../../../plugins/auth';

const userRoutesById: FastifyPluginAsync = async (app) => {
  const userController = new UserController();

  app.get('/user/:id', {
    schema: {
      tags: ['User'],
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string() }),
      response: { 200: z.object({ user: getAllUsersSchema }) },
    },
    preHandler: auth,
    handler: userController.getUserById,
  });

  app.put('/user/:id', {
    schema: {
      tags: ['User'],
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string() }),
      body: createUserSchema,
      response: { 200: z.object({ user: getAllUsersSchema }) },
    },
    preHandler: auth,
    handler: userController.updateUser,
  });

  app.delete('/user/:id', {
    schema: {
      tags: ['User'],
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string() }),
      response: { 200: z.object({ message: z.string() }) },
    },
    preHandler: auth,
    handler: userController.deleteUser,
  });
};

export { userRoutesById };
