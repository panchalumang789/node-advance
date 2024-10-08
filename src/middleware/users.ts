import type {} from '../plugins/extenstion';

import { z } from 'zod';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

import { createUserSchema } from '../schema/user';

const validateUserData = (
  request: FastifyRequest,
  _: FastifyReply,
  next: (err?: FastifyError) => void
) => {
  if (!request.body) next({ code: '404', name: 'Error', message: 'User details required' });

  try {
    const data = createUserSchema.parse(request.body);
    request.validatedUserData = data;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError: Record<string, string> = {};
      error.issues.forEach((err) => (zodError[err.path[0]] = err.message));
      next({ code: '404', name: 'Error', message: JSON.stringify(zodError) });
    }
  }
};

export { validateUserData };
