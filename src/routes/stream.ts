import { createWriteStream } from 'fs';
import { FastifyPluginAsync } from 'fastify';

import { readFileStream } from '../streams/readFile';

const streamRoutes: FastifyPluginAsync = async (fastify) => {
  const logStream = createWriteStream('requests.log', { flags: 'a' });
  fastify.addHook('onRequest', (request, reply, next) => {
    const logEntry = `${new Date().toISOString()} - ${request.method} ${request.url}\n`;
    logStream.write(logEntry, (err) => {
      if (err) fastify.log.error(err);
    });
    next();
  });

  fastify.get('/readfile-stream', (_, reply) => {
    try {
      readFileStream().on('line', (line) => {
        if (line.includes('Streams') || line.includes('Streams'.toLocaleLowerCase())) {
          reply.log.info(line);
        }
      });

      readFileStream().on('close', () => {
        reply.status(200).send({ hello: 'Read file stream closed' });
      });
    } catch (error) {
      if (error instanceof Error) {
        reply.log.error(error.message);
        reply.code(500).send({ message: 'Internal server error.' });
      }
    }
  });
};

export { streamRoutes };
