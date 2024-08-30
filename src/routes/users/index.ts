import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';

import { UserController } from '../../controllers/users';
import { validateUserData } from '../../middleware/users';
import { auth, specificAdminAuth } from '../../plugins/auth';
import { createUserSchema, getAllUsersSchema } from '../../schema/user';

const usersRoutes: FastifyPluginAsync = async (app) => {
  const userController = new UserController();

  app.get('/users', {
    schema: {
      tags: ['User'],
      response: { 200: z.object({ users: z.array(getAllUsersSchema) }) },
    },
    preHandler: app.rateLimit(),
    handler: userController.getAllUsers,
  });

  app.get('/user/:id', {
    schema: {
      tags: ['User'],
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string().uuid('Invalid user id') }),
      response: { 200: z.object({ user: getAllUsersSchema }) },
    },
    preHandler: [app.rateLimit(), auth],
    handler: userController.getUserById,
  });

  app.put('/user/:id', {
    schema: {
      tags: ['User'],
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string().uuid('Invalid user id') }),
      body: createUserSchema,
      response: { 200: z.object({ user: getAllUsersSchema }) },
    },
    preHandler: [app.rateLimit(), validateUserData, auth],
    handler: userController.updateUser,
  });

  app.delete('/user/:id', {
    schema: {
      tags: ['User'],
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string().uuid('Invalid user id') }),
      response: { 200: z.object({ message: z.string() }) },
    },
    preHandler: [app.rateLimit(), specificAdminAuth],
    handler: userController.deleteUser,
  });
};

export { usersRoutes };
