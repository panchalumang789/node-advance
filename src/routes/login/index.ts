import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';

import { validateData } from '../../middleware/users';
import { UserController } from '../../controllers/users';
import { createUserSchema, getAllUsersSchema } from '../../schema/user';

const loginRoutes: FastifyPluginAsync = async (app) => {
  const userController = new UserController();

  app.post('/login', {
    schema: {
      tags: ['Login'],
      body: createUserSchema,
      response: { 200: z.object({ user: getAllUsersSchema }) },
    },
    preHandler: validateData,
    handler: userController.createUser,
  });

  app.post('/register', {
    schema: {
      tags: ['Login'],
      body: createUserSchema,
      response: { 200: z.object({ user: getAllUsersSchema }) },
    },
    preHandler: validateData,
    handler: userController.createUser,
  });
};

export { loginRoutes };
