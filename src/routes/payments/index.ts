import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';

import { specificAdminAuth } from '../../plugins/auth';
import { PaymentController } from '../../controllers/payments';
import { validatePaymentData } from '../../middleware/payments';
import { createPaymentSchema, getAllPaymentsSchema } from '../../schema/payments';

const paymentsRoutes: FastifyPluginAsync = async (app) => {
  const paymentController = new PaymentController();

  app.get('/payments', {
    schema: {
      tags: ['Payment'],
      response: { 200: z.object({ payments: z.array(getAllPaymentsSchema) }) },
    },
    preHandler: app.rateLimit(),
    handler: paymentController.getAllPayments,
  });

  app.get('/payment/:id', {
    schema: {
      tags: ['Payment'],
      params: z.object({ id: z.string().uuid('Invalid payment id') }),
      response: { 200: z.object({ payment: getAllPaymentsSchema }) },
    },
    preHandler: app.rateLimit(),
    handler: paymentController.getPaymentById,
  });

  app.post('/payment', {
    schema: {
      tags: ['Payment'],
      security: [{ bearerAuth: [] }],
      body: createPaymentSchema,
      response: { 200: z.object({ payment: getAllPaymentsSchema }) },
    },
    preHandler: [specificAdminAuth, validatePaymentData],
    handler: paymentController.createPayment,
  });

  app.put('/payment/:id', {
    schema: {
      tags: ['Payment'],
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string().uuid('Invalid payment id') }),
      body: createPaymentSchema,
      response: { 200: z.object({ payment: getAllPaymentsSchema }) },
    },
    preHandler: [app.rateLimit(), specificAdminAuth, validatePaymentData],
    handler: paymentController.updatePayment,
  });

  app.delete('/payment/:id', {
    schema: {
      tags: ['Payment'],
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string().uuid('Invalid payment id') }),
      response: { 200: z.object({ message: z.string() }) },
    },
    preHandler: [app.rateLimit(), specificAdminAuth],
    handler: paymentController.deletePayment,
  });
};

export { paymentsRoutes };
