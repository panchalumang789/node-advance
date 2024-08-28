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

  app.decorateRequest('token', '');

  app.addHook('onResponse', async (request, reply) => {
    console.log('asdasdd', app.token);
    // let { userId, email } = await request.jwtVerify();
    // userId = AESEncryption.decrypt(userId);
    // request.currentUser = { userId, email };
  });

  // app.addHook('onRequest', async (request, response) => {
  //   try {
  //     if (!request.url.startsWith('/docs')) {
  //       const tableExist = await db.schema.hasTable('users');
  //       if (!tableExist) throw app.httpErrors.notFound('Table does not exist');
  //       app.decorate('token', 'Umang Panchal');
  //     }
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       response.code(400).send({ ...error });
  //     }
  //   }
  //   // if (app.token) {
  //   //   request.headers['authorization'] = `Umang Panchal`;
  //   //   // request.headers['authorization'] = `Bearer ${request.server.token}`;
  //   // }
  //   // const token =
  //   //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNiNzBmZDdhLTkyYTEtNGI3MS1hOWZjLTFiMjY1MTg3MWI0MSIsImVtYWlsIjoidW1hbmcxQGdtYWlsLmNvbSIsInJvbGUiOiIwIiwiaWF0IjoxNzI0ODQ5OTQyLCJleHAiOjE3MjQ4NTM1NDJ9.XZLVckWSc3_3_r-i4_Xj4rPe-FPoQ-df-pUv6d9QI7g';
  // });
};

export const swaggerOnReady = (app: FastifyInstance) => {
  app.swagger();
};
