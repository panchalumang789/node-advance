import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { usersMiddleware, usersMiddleware2 } from "../middleware/users";
import { IncomingMessage, Server, ServerResponse } from "http";

async function routes(fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>) {
    fastify.post('/helloTest', {
        preHandler: [usersMiddleware],
        handler: async (request: FastifyRequest, reply: FastifyReply) => {
            reply.send({ hello: 'zxc' })
        }
    })

    fastify.post('/helloTest1', {
        preHandler: [usersMiddleware2],
        handler: async (request: FastifyRequest, reply: FastifyReply) => {
            reply.send({ hello: 'zxc' })
        }
    })
}

export default routes;