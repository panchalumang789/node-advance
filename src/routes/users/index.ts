import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';

import { getAllUsersSchema } from '../../schema/user';
import { UserController } from '../../controllers/users';

const usersRoutes: FastifyPluginAsync = async (app) => {
  const userController = new UserController();

  app.get('/users', {
    schema: {
      tags: ['User'],
      response: { 200: z.object({ users: z.array(getAllUsersSchema) }) },
    },
    handler: userController.getAllUsers,
  });
};

export { usersRoutes };
