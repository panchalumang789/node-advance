import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

import db from '../../config/db';

export const swaggerPlugin: FastifyPluginAsync<{ routePrefix: string }> = async (app, options) => {
  await app.register(fastifySwagger, {
    openapi: {
      openapi: '3.0.3',
      info: {
        title: 'Node Advance',
        version: '0.1.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [],
    },
    transform: jsonSchemaTransform,
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: options.routePrefix,
    initOAuth: {},
  });

  app.addHook('onRequest', async (request, response) => {
    try {
      if (!request.url.startsWith('/docs')) {
        const tableExist = await db.schema.hasTable('users');
        if (!tableExist) throw app.httpErrors.notFound('Table does not exist');
      }
    } catch (error) {
      if (error instanceof Error) {
        response.code(400).send({ ...error });
      }
    }
  });
};

export const swaggerOnReady = (app: FastifyInstance) => {
  app.swagger();
};
