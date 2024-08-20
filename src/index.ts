import EventEmitter from "events";

import { createApp } from "./app";

const emitter = new EventEmitter()

const start = async (port: number) => {
  const app = await createApp({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
  });

  const serverStarted = (message: string, type: string) => {
    if (type === 'log') app.log.info(message)
    else app.log.error(message)
  }
  emitter.on('serverStarted', serverStarted)

  app.listen({ port: 3000 }, (err, address) => {
    if (err) {
      emitter.emit('serverStarted', err.message)
      process.exit(1);
    } else {
      emitter.emit('serverStarted', 'server listening on ' + address, 'log')
    }
  });
};

start(3000)
