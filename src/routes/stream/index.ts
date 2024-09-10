import path from 'path';
import { createWriteStream } from 'fs';
import { FastifyPluginAsync } from 'fastify';
import { isMainThread, Worker } from 'worker_threads';

import { readFileStream } from '../../streams/readFile';

function runWorker() {
  return new Promise((resolve, reject) => {
    if (isMainThread) {
      const numWorkers = 5;
      const workers = [];

      for (let i = 0; i < numWorkers; i++) {
        workers.push(new Worker(path.resolve(__dirname, 'worker.js'), { workerData: i }));
      }

      // Send data to workers
      workers.forEach((worker, index) => {
        worker.postMessage(`Hello from main thread ${index}!`);
      });

      // Receive data from workers
      let result: Record<string, number>[] = [];
      let count = 0;
      workers.forEach((worker, index) => {
        worker.on('message', (message: number) => {
          result.push({ [index]: message });
          count++;
          if (count === workers.length) {
            resolve({ message: result });
          }
        });

        worker.on('error', (error) => {
          reject(error);
        });
      });
    }
  });
}

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
          reply.status(200).send({ message: line });
        }
      });
      readFileStream().on('close', () => {
        reply.log.info({ message: 'Read file stream closed' });
      });
    } catch (error) {
      if (error instanceof Error) {
        reply.log.error(error.message);
        reply.code(500).send({ message: 'Internal server error.' });
      }
    }
  });

  fastify.get('/parallel-task', async (request, reply) => {
    try {
      const result = await runWorker();
      return reply.send({ result });
    } catch (error) {
      if (error instanceof Error) {
        reply.log.error(error.message);
        reply.code(500).send({ message: 'Internal server error.' });
      }
    }
  });
};

export { streamRoutes };
