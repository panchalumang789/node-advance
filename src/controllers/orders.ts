import { z } from 'zod';
import { FastifyReply, FastifyRequest } from 'fastify';

import db from '../config/db';

export class OrderController {
  getAllOrders = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const orders = await db('orders').select('*');
      if (!orders) {
        throw request.server.httpErrors.badRequest('Orders not found');
      }
      return reply.code(200).send({ orders });
    } catch (error) {
      if (error instanceof Error && error.name === 'NoSuchKey') {
        throw request.server.httpErrors.notFound('Orders not found');
      }
      throw error;
    }
  };

  getAllOrdersData = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const ordersData = await db
        .select('orders.*', {
          user: db.raw('ROW_TO_JSON(users.*)'),
          payments: db.raw('json_agg(DISTINCT payments.*)'),
        })
        .from('orders')
        .leftJoin('users', 'orders.user_id', 'users.id')
        .leftJoin('payments', 'orders.id', 'payments.order_id')
        .groupBy('orders.id', 'users.id');

      const orders = await Promise.all(
        ordersData.map(async (order) => {
          let orderItems = await db
            .select('orderitems.*', { product: db.raw('ROW_TO_JSON(products.*)') })
            .from('orderitems')
            .leftJoin('products', 'orderitems.product_id', 'products.id')
            .where('orderitems.order_id', '=', order.id)
            .groupBy('orderitems.id', 'products.id');

          return { ...order, orderItems };
        })
      );

      if (!orders) {
        throw request.server.httpErrors.badRequest('Orders not found');
      }
      return reply.code(200).send({ orders });
    } catch (error) {
      if (error instanceof Error && error.name === 'NoSuchKey') {
        throw request.server.httpErrors.notFound('Orders not found');
      }
      throw error;
    }
  };

  getOrderById = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;

      const order = await db('orders').select('*').where({ id }).first();

      if (!order) {
        throw request.server.httpErrors.badRequest('Order not found');
      }
      return reply.code(200).send({ order });
    } catch (error) {
      if (error instanceof Error) {
        return reply.code(500).send({ message: error.message });
      } else {
        return reply.code(404).send({ message: 'Order not found' });
      }
    }
  };

  getOrderDataById = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;

      const order = await db
        .select('orders.*', {
          user: db.raw('ROW_TO_JSON(users.*)'),
          payments: db.raw('json_agg(DISTINCT payments.*)'),
        })
        .from('orders')
        .leftJoin('users', 'orders.user_id', 'users.id')
        .leftJoin('payments', 'orders.id', 'payments.order_id')
        .where('orders.id', '=', id)
        .groupBy('orders.id', 'users.id')
        .first()
        .then(async (data) => {
          const result: any = { ...data };
          const orderItems = await db
            .select('orderitems.*', { product: db.raw('ROW_TO_JSON(products.*)') })
            .from('orderitems')
            .leftJoin('products', 'orderitems.product_id', 'products.id')
            .groupBy('orderitems.id', 'products.id');
          result['orderItems'] = orderItems;
          return result;
        });

      if (!order) {
        throw request.server.httpErrors.badRequest('Order not found');
      }
      return reply.code(200).send({ order });
    } catch (error) {
      if (error instanceof Error) {
        return reply.code(500).send({ message: error.message });
      } else {
        return reply.code(404).send({ message: 'Order not found' });
      }
    }
  };

  createOrder = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.validatedOrderData) {
        throw request.server.httpErrors.badRequest('Order data not found');
      }
      const [order] = await db('orders').insert(request.validatedOrderData).returning('*');
      if (!order) {
        throw request.server.httpErrors.badRequest('Order creation failed');
      }
      return reply.code(200).send({ order });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ message: error.issues[0].message });
      } else if (error instanceof Error) {
        if (
          'code' in error &&
          'constraint' in error &&
          'detail' in error &&
          error.code === '23505'
        ) {
          return reply
            .code(409)
            .send({ message: [{ [error.constraint as string]: error.detail }] });
        } else {
          return reply.code(500).send({ message: error.message });
        }
      }
    }
  };

  updateOrder = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      if (!request.validatedOrderData) {
        throw request.server.httpErrors.badRequest('Order data not found');
      }

      const { id } = request.params;
      const existingOrder = await db('orders').select('id').where({ id }).first();
      if (!existingOrder) {
        throw request.server.httpErrors.badRequest('Order not found');
      }

      const [order] = await db('orders')
        .update(request.validatedOrderData)
        .where({ id })
        .returning('*');

      if (!order) {
        throw request.server.httpErrors.badRequest('Order update failed');
      }
      return reply.code(200).send({ order });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ message: error.issues[0].message });
      } else if (error instanceof Error) {
        if (
          'code' in error &&
          'constraint' in error &&
          'detail' in error &&
          error.code === '23505'
        ) {
          return reply
            .code(409)
            .send({ message: [{ [error.constraint as string]: error.detail }] });
        } else {
          return reply.code(500).send({ message: error.message });
        }
      }
    }
  };

  deleteOrder = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params as FastifyRequest<{ Params: { id: string } }>;
      const order = await db('orders').delete().where({ id });
      if (!order) throw request.server.httpErrors.badRequest('Order not found');
      return reply.code(200).send({ message: `${order} order deleted` });
    } catch (error) {
      if (error instanceof Error) {
        return reply.code(500).send({ message: error.message });
      }
    }
  };
}
