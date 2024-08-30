import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';

import { loginSchema } from '../../schema/login';
import { LoginController } from '../../controllers/login';
import { validateUserData } from '../../middleware/users';
import { createUserSchema, getAllUsersSchema } from '../../schema/user';

const loginRoutes: FastifyPluginAsync = async (app) => {
  const loginController = new LoginController();

  app.post('/login', {
    schema: {
      tags: ['Login'],
      body: loginSchema,
      response: { 200: z.object({ token: z.string() }) },
    },
    preHandler: app.rateLimit(),
    handler: loginController.login,
  });

  app.post('/register', {
    schema: {
      tags: ['Login'],
      body: createUserSchema,
      response: { 200: z.object({ user: getAllUsersSchema }) },
    },
    preHandler: [app.rateLimit(), validateUserData],
    handler: loginController.register,
  });
};

export { loginRoutes };
