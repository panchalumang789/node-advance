import type {} from '../plugins/extenstion';

import { z } from 'zod';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

import { createOrderSchema } from '../schema/orders';

const validateOrderData = (
  request: FastifyRequest,
  _: FastifyReply,
  next: (err?: FastifyError) => void
) => {
  if (!request.body) next({ code: '404', name: 'Error', message: 'Order details required' });

  try {
    const data = createOrderSchema.parse(request.body);
    request.validatedOrderData = data;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError: Record<string, string> = {};
      error.issues.forEach((err) => (zodError[err.path[0]] = err.message));
      next({ code: '404', name: 'Error', message: JSON.stringify(zodError) });
    }
  }
};

export { validateOrderData };
