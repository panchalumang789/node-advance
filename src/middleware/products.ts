/// <reference path="../plugins/extenstion.d.ts" />

import { z } from 'zod';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

import { createProductSchema } from '../schema/products';

const validateProductData = (
  request: FastifyRequest,
  _: FastifyReply,
  next: (err?: FastifyError) => void
) => {
  if (!request.body) next({ code: '404', name: 'Error', message: 'User details required' });

  try {
    const data = createProductSchema.parse(request.body);
    request.validatedProductData = data;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError: Record<string, string> = {};
      error.issues.forEach((err) => (zodError[err.path[0]] = err.message));
      next({ code: '404', name: 'Error', message: JSON.stringify(zodError) });
    }
  }
};

export { validateProductData };
