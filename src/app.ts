import { z } from 'zod';
import { config } from 'dotenv';
import { createClient, RedisClientType } from 'redis';
import fastifyJwt from '@fastify/jwt';
import fastifyEtag from '@fastify/etag';
import fastifyFormbody from '@fastify/formbody';
import fastifySensible from '@fastify/sensible';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import fastify, { FastifyInstance, FastifyServerOptions, RegisterOptions } from 'fastify';

config();
import * as routes from './routes';
import { APP_PREFIX, ENVIRONMENT, SWAGGER_URL } from './config';
import { swaggerOnReady, swaggerPlugin } from './plugins/swagger';

export const createApp = async (opts: FastifyServerOptions = { logger: false }) => {
  const app = fastify(opts);
  app.register(fastifyEtag);
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(fastifyFormbody);
  await app.register(fastifyJwt, { secret: process.env.JWT_SECRET as string });
  await app.register(fastifySensible, {
    logLevel: ['dev', 'test'].includes(ENVIRONMENT) ? 'debug' : 'warn',
  });

  await swaggerPlugin(app, { routePrefix: SWAGGER_URL });

  registerRoutes(app, { prefix: APP_PREFIX });

  // Error Handler
  app.setErrorHandler((error, _, reply) => {
    const { code, message } = error;
    if (error instanceof z.ZodError) {
      const zodError = error.issues.map((err) => ({ [err.path[0]]: err.message }));
      reply.code(400).send({ message: zodError });
    } else {
      if (error.name === 'TokenExpiredError')
        reply.code(+code || 500).send({ message: 'Token expired' });
      else reply.code(+code || 500).send({ message });
    }
  });

  await app.ready();

  swaggerOnReady(app);

  const client = await createClient()
    .on('error', (err) => console.log('Redis Client Error', err))
    .connect();
  app.redisServer = client as RedisClientType;

  return app;
};

function registerRoutes(app: FastifyInstance, { prefix }: RegisterOptions) {
  app.log.info('Registering routes...');
  for (const routeModule of Object.values(routes)) {
    if (Object.keys(routeModule).length > 0) {
      const routes = Object.values(routeModule)[0];
      app.register(routes, { prefix });
    }
  }
}
