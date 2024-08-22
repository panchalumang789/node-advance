import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';

import { auth } from '../../../plugins/auth';
import { validateData } from '../../../middleware/users';
import { UserController } from '../../../controllers/users';
import { createUserSchema, getAllUsersSchema } from '../../../schema/user';

const userRoutesById: FastifyPluginAsync = async (app) => {
  const userController = new UserController();

  app.get('/user/:id', {
    schema: {
      tags: ['User'],
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string() }),
      response: { 200: z.object({ user: getAllUsersSchema }) },
    },
    preHandler: [validateData, auth],
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
    preHandler: [validateData, auth],
    handler: userController.updateUser,
  });

  app.delete('/user/:id', {
    schema: {
      tags: ['User'],
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string() }),
      response: { 200: z.object({ message: z.string() }) },
    },
    preHandler: [validateData, auth],
    handler: userController.deleteUser,
  });
};

export { userRoutesById };
