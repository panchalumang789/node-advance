import { FastifyPluginAsync } from "fastify";
import { SWAGGER_URL } from "../../config";
import fastifyJwt from "@fastify/jwt";


export const authPlugin: FastifyPluginAsync = async (app) => {
  // app.addHook('onRequest', (request, _, next) => {
  //   if (request.originalUrl === SWAGGER_URL) {
  //     next()
  //   }

  //   const token = request.headers.authorization
  //   // if (!token) {
  //   //   throw app.httpErrors.unauthorized();
  //   // }
  //   request.auth = {
  //     user: { email: token }
  //   }
  // })

  // await app.register(fastifyJwt, {
  //   secret: 'node_advance_secret_key',  // Replace with your secret key
  // });
  // app.addHook('onRequest', (request, reply, next) => {
  // const securitySchema = request.context.config?.schema?.security;
  // console.log('index_21-securitySchema==>', request)
  // if (securitySchema) {
  //   try {
  //     const token = request.headers.authorization;

  //     // Check if the token is present
  //     if (!token) {
  //       reply.status(401).send({ error: 'Missing token' });
  //       return;
  //     }

  //     // Validate the token (implement your logic here)
  //     // const user = verifyToken(token);
  //     // if (!user) {
  //     //   reply.status(401).send({ error: 'Unauthorized' });
  //     //   return;
  //     // }

  //     // Attach the user to the request object
  //     // request.user = user;
  //   } catch (error) {
  //     reply.status(401).send({ error: 'Unauthorized' });
  //   }
  // }
  // })
}