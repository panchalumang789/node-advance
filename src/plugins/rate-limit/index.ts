import { FastifyPluginAsync } from 'fastify';
import fastifyRateLimit from '@fastify/rate-limit';

export const rateLimitPlugin: FastifyPluginAsync<{ max: number }> = async (app, { max }) => {
  await app.register(fastifyRateLimit, {
    global: false,
    max,
    timeWindow: 1000 * 60,
    cache: 10000,
    allowList: ['127.0.0.1'],
    redis: app.redisServer,
    skipOnError: false,
  });

  app.setNotFoundHandler(
    {
      preHandler: app.rateLimit(),
    },
    function (_, reply) {
      reply.code(404).send({ hello: 'world' });
    }
  );
};
