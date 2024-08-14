import Fastify from "fastify";
import EventEmitter from "events";

const emitter = new EventEmitter()
const fastify = Fastify({ logger: true });

import * as routes from './routes';

function registerRoute() {
  fastify.log.info("Registering routes...");
  for (const routeModule of Object.values(routes)) {
    if (Object.keys(routeModule).length > 0) {
      const routes = Object.values(routeModule)[0]
      fastify.register(routes)
    }
  }
}
registerRoute()

// Declare a route
fastify.get("/", (req, res) => {
  res.status(200).send({ hello: "world" });
});

// Error Handler
fastify.setErrorHandler((error, _, reply) => {
  const { code, message } = error;
  reply.code(+code || 500).send({ message });
});

// Run the server!
const serverStarted = (message: string, type: string) => {
  if (type === 'log') fastify.log.info(message)
  else fastify.log.error(message)
}
emitter.on('serverStarted', serverStarted)

fastify.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    emitter.emit('serverStarted', err.message)
    process.exit(1);
  } else { emitter.emit('serverStarted', 'server listening on ' + address, 'log') }
});
