import type {} from '../plugins/extenstion';

import { z } from 'zod';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

import { createPaymentSchema } from '../schema/payments';

const validatePaymentData = (
  request: FastifyRequest,
  _: FastifyReply,
  next: (err?: FastifyError) => void
) => {
  if (!request.body) next({ code: '404', name: 'Error', message: 'Payment details required' });

  try {
    const data = createPaymentSchema.parse(request.body);
    request.validatedPaymentData = data;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError: Record<string, string> = {};
      error.issues.forEach((err) => (zodError[err.path[0]] = err.message));
      next({ code: '404', name: 'Error', message: JSON.stringify(zodError) });
    }
  }
};

export { validatePaymentData };
