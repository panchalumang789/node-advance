import { z } from 'zod';
import { FastifyReply, FastifyRequest } from 'fastify';

import db from '../config/db';

export class PaymentController {
  getAllPayments = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const payments = await db('payments').select('*');
      if (!payments) {
        throw request.server.httpErrors.badRequest('Payments not found');
      }
      return reply.code(200).send({ payments });
    } catch (error) {
      if (error instanceof Error && error.name === 'NoSuchKey') {
        throw request.server.httpErrors.notFound('Payments not found');
      }
      throw error;
    }
  };

  getPaymentById = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;
      const payment = await db('payments').select('*').where({ id }).first();
      if (!payment) {
        throw request.server.httpErrors.badRequest('Payment not found');
      }
      return reply.code(200).send({ payment });
    } catch (error) {
      if (error instanceof Error) {
        return reply.code(500).send({ message: error.message });
      } else {
        return reply.code(404).send({ message: 'Payment not found' });
      }
    }
  };

  createPayment = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.validatedPaymentData) {
        throw request.server.httpErrors.badRequest('Payment data not found');
      }
      const [payment] = await db('payments').insert(request.validatedPaymentData).returning('*');
      if (!payment) {
        throw request.server.httpErrors.badRequest('Payment creation failed');
      }
      return reply.code(200).send({ payment });
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

  updatePayment = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      if (!request.validatedPaymentData) {
        throw request.server.httpErrors.badRequest('Payment data not found');
      }

      const { id } = request.params;
      const existingPayment = await db('payments').select('id').where({ id }).first();
      if (!existingPayment) {
        throw request.server.httpErrors.badRequest('Payment not found');
      }

      const [payment] = await db('payments')
        .update(request.validatedPaymentData)
        .where({ id })
        .returning('*');

      if (!payment) {
        throw request.server.httpErrors.badRequest('Payment update failed');
      }
      return reply.code(200).send({ payment });
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

  deletePayment = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params as FastifyRequest<{ Params: { id: string } }>;
      const payment = await db('payments').delete().where({ id });
      if (!payment) throw request.server.httpErrors.badRequest('Payment not found');
      return reply.code(200).send({ message: `${payment} payment deleted` });
    } catch (error) {
      if (error instanceof Error) {
        return reply.code(500).send({ message: error.message });
      }
    }
  };
}
