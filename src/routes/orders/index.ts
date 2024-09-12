import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';

import { specificAdminAuth } from '../../plugins/auth';
import { OrderController } from '../../controllers/orders';
import { validateOrderData } from '../../middleware/order';
import { createOrderSchema, getAllOrdersSchema, getOrderValueSchema } from '../../schema/orders';

const ordersRoutes: FastifyPluginAsync = async (app) => {
  const orderController = new OrderController();

  app.get('/orders', {
    schema: {
      tags: ['Order'],
      response: { 200: z.object({ orders: z.array(getAllOrdersSchema) }) },
    },
    preHandler: app.rateLimit(),
    handler: orderController.getAllOrders,
  });

  app.get('/ordersData', {
    schema: {
      tags: ['Order'],
      response: { 200: z.object({ orders: z.array(getOrderValueSchema) }) },
    },
    preHandler: app.rateLimit(),
    handler: orderController.getAllOrdersData,
  });

  app.get('/order/:id', {
    schema: {
      tags: ['Order'],
      params: z.object({ id: z.string().uuid('Invalid order id') }),
      response: { 200: z.object({ order: getAllOrdersSchema }) },
    },
    preHandler: app.rateLimit(),
    handler: orderController.getOrderById,
  });

  app.get('/orderData/:id', {
    schema: {
      tags: ['Order'],
      params: z.object({ id: z.string().uuid('Invalid order id') }),
      response: { 200: z.object({ order: getOrderValueSchema }) },
    },
    preHandler: app.rateLimit(),
    handler: orderController.getOrderDataById,
  });

  app.post('/order', {
    schema: {
      tags: ['Order'],
      security: [{ bearerAuth: [] }],
      body: createOrderSchema,
      response: { 200: z.object({ order: getAllOrdersSchema }) },
    },
    preHandler: [specificAdminAuth, validateOrderData],
    handler: orderController.createOrder,
  });

  app.put('/order/:id', {
    schema: {
      tags: ['Order'],
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string().uuid('Invalid order id') }),
      body: createOrderSchema,
      response: { 200: z.object({ order: getAllOrdersSchema }) },
    },
    preHandler: [app.rateLimit(), specificAdminAuth, validateOrderData],
    handler: orderController.updateOrder,
  });

  app.delete('/order/:id', {
    schema: {
      tags: ['Order'],
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string().uuid('Invalid order id') }),
      response: { 200: z.object({ message: z.string() }) },
    },
    preHandler: [app.rateLimit(), specificAdminAuth],
    handler: orderController.deleteOrder,
  });
};

export { ordersRoutes };
