import { FastifyReply, FastifyRequest } from "fastify";
import { usersMiddleware } from "../middleware/users";

async function routes(fastify: any, options: any) {
    fastify.get('/helloTest', {
        before: [usersMiddleware,],
        handler: async (request: FastifyRequest, reply: FastifyReply) => {
            reply.send({ hello: 'zxc' })

        }
    })

}

export default routes;