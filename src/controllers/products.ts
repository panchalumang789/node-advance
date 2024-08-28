import { z } from 'zod';
import { FastifyReply, FastifyRequest } from 'fastify';

import db from '../config/db';

export class ProductController {
  getAllProducts = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const products = await db('products').select('*');
      if (!products) {
        throw request.server.httpErrors.badRequest('Products not found');
      }
      return reply.code(200).send({ products });
    } catch (error) {
      if (error instanceof Error && error.name === 'NoSuchKey') {
        throw request.server.httpErrors.notFound('Products not found');
      }
      throw error;
    }
  };

  getProductById = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;
      const product = await db('products').select('*').where({ id }).first();
      if (!product) {
        throw request.server.httpErrors.badRequest('Product not found');
      }
      return reply.code(200).send({ product });
    } catch (error) {
      if (error instanceof Error) {
        return reply.code(500).send({ message: error.message });
      } else {
        return reply.code(404).send({ message: 'Product not found' });
      }
    }
  };

  createProduct = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.validatedProductData) {
        throw request.server.httpErrors.badRequest('Product data not found');
      }
      const [product] = await db('products').insert(request.validatedProductData).returning('*');
      if (!product) {
        throw request.server.httpErrors.badRequest('Product creation failed');
      }
      return reply.code(200).send({ product });
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

  updateProduct = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      if (!request.validatedProductData) {
        throw request.server.httpErrors.badRequest('Product data not found');
      }

      const { id } = request.params;
      const existingProduct = await db('products').select('id').where({ id }).first();
      if (!existingProduct) {
        throw request.server.httpErrors.badRequest('Product not found');
      }

      const [product] = await db('products')
        .update(request.validatedProductData)
        .where({ id })
        .returning('*');

      if (!product) {
        throw request.server.httpErrors.badRequest('Product update failed');
      }
      return reply.code(200).send({ product });
    } catch (error) {
      console.log('products_97-error==>', error);
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

  deleteProduct = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params as FastifyRequest<{ Params: { id: string } }>;
      const product = await db('products').delete().where({ id });
      if (!product) throw request.server.httpErrors.badRequest('Product not found');
      return reply.code(200).send({ message: `${product} product deleted` });
    } catch (error) {
      if (error instanceof Error) {
        return reply.code(500).send({ message: error.message });
      }
    }
  };
}
