import { z } from 'zod';
import { FastifyReply, FastifyRequest } from 'fastify';

import db from '../config/db';

export class OrderItemController {
  getAllOrderItems = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const orderItems = await db('orderItems').select('*');
      if (!orderItems) {
        throw request.server.httpErrors.badRequest('OrderItems not found');
      }
      return reply.code(200).send({ orderItems });
    } catch (error) {
      if (error instanceof Error && error.name === 'NoSuchKey') {
        throw request.server.httpErrors.notFound('OrderItems not found');
      }
      throw error;
    }
  };

  getOrderItemById = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;
      const orderItem = await db('orderItems').select('*').where({ id }).first();
      if (!orderItem) {
        throw request.server.httpErrors.badRequest('OrderItem not found');
      }
      return reply.code(200).send({ orderItem });
    } catch (error) {
      if (error instanceof Error) {
        return reply.code(500).send({ message: error.message });
      } else {
        return reply.code(404).send({ message: 'OrderItem not found' });
      }
    }
  };

  createOrderItem = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.validatedOrderItemData) {
        throw request.server.httpErrors.badRequest('OrderItem data not found');
      }
      const [orderItem] = await db('orderItems')
        .insert(request.validatedOrderItemData)
        .returning('*');
      if (!orderItem) {
        throw request.server.httpErrors.badRequest('OrderItem creation failed');
      }
      return reply.code(200).send({ orderItem });
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

  updateOrderItem = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      if (!request.validatedOrderItemData) {
        throw request.server.httpErrors.badRequest('OrderItem data not found');
      }

      const { id } = request.params;
      const existingOrderItem = await db('orderItems').select('id').where({ id }).first();
      if (!existingOrderItem) {
        throw request.server.httpErrors.badRequest('OrderItem not found');
      }

      const [orderItem] = await db('orderItems')
        .update(request.validatedOrderItemData)
        .where({ id })
        .returning('*');

      if (!orderItem) {
        throw request.server.httpErrors.badRequest('OrderItem update failed');
      }
      return reply.code(200).send({ orderItem });
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

  deleteOrderItem = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params as FastifyRequest<{ Params: { id: string } }>;
      const orderItem = await db('orderItems').delete().where({ id });
      if (!orderItem) throw request.server.httpErrors.badRequest('OrderItem not found');
      return reply.code(200).send({ message: `${orderItem} orderItem deleted` });
    } catch (error) {
      if (error instanceof Error) {
        return reply.code(500).send({ message: error.message });
      }
    }
  };
}
