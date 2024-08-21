import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';

import { validateData } from '../../middleware/users';
import { UserController } from '../../controllers/users';
import { createUserSchema, getAllUsersSchema } from '../../schema/user';

const userRoutes: FastifyPluginAsync = async (app) => {
  const userController = new UserController();

  app.post('/user', {
    schema: {
      tags: ['User'],
      body: createUserSchema,
      response: { 200: z.object({ user: getAllUsersSchema }) },
    },
    preHandler: validateData,
    handler: userController.createUser,
  });
};

export { userRoutes };
