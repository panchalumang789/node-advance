import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';

import { validateData } from '../../middleware/users';
import { getAllUsersSchema } from '../../schema/user';
import { LoginController } from '../../controllers/login';
import { loginSchema, registerSchema } from '../../schema/login';

const loginRoutes: FastifyPluginAsync = async (app) => {
  const loginController = new LoginController();

  app.post('/login', {
    schema: {
      tags: ['Login'],
      body: loginSchema,
      response: { 200: z.object({ token: z.string() }) },
    },
    handler: loginController.login,
  });

  app.post('/register', {
    schema: {
      tags: ['Login'],
      body: registerSchema,
      response: { 200: z.object({ user: getAllUsersSchema }) },
    },
    preHandler: validateData,
    handler: loginController.register,
  });
};

export { loginRoutes };
