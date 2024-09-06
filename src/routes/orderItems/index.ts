import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';

import { specificAdminAuth } from '../../plugins/auth';
import { OrderItemController } from '../../controllers/orderItems';
import { validateOrderItemsData } from '../../middleware/orderItems';
import { createOrderItemSchema, getAllOrderItemsSchema } from '../../schema/orderItems';

const orderItemsRoutes: FastifyPluginAsync = async (app) => {
  const orderItemController = new OrderItemController();

  app.get('/orderItems', {
    schema: {
      tags: ['OrderItem'],
      response: { 200: z.object({ orderItems: z.array(getAllOrderItemsSchema) }) },
    },
    preHandler: app.rateLimit(),
    handler: orderItemController.getAllOrderItems,
  });

  app.get('/orderItem/:id', {
    schema: {
      tags: ['OrderItem'],
      params: z.object({ id: z.string().uuid('Invalid orderItem id') }),
      response: { 200: z.object({ orderItem: getAllOrderItemsSchema }) },
    },
    preHandler: app.rateLimit(),
    handler: orderItemController.getOrderItemById,
  });

  app.post('/orderItem', {
    schema: {
      tags: ['OrderItem'],
      security: [{ bearerAuth: [] }],
      body: createOrderItemSchema,
      response: { 200: z.object({ orderItem: getAllOrderItemsSchema }) },
    },
    preHandler: [specificAdminAuth, validateOrderItemsData],
    handler: orderItemController.createOrderItem,
  });

  app.put('/orderItem/:id', {
    schema: {
      tags: ['OrderItem'],
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string().uuid('Invalid orderItem id') }),
      body: createOrderItemSchema,
      response: { 200: z.object({ orderItem: getAllOrderItemsSchema }) },
    },
    preHandler: [app.rateLimit(), specificAdminAuth, validateOrderItemsData],
    handler: orderItemController.updateOrderItem,
  });

  app.delete('/orderItem/:id', {
    schema: {
      tags: ['OrderItem'],
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string().uuid('Invalid orderItem id') }),
      response: { 200: z.object({ message: z.string() }) },
    },
    preHandler: [app.rateLimit(), specificAdminAuth],
    handler: orderItemController.deleteOrderItem,
  });
};

export { orderItemsRoutes };
