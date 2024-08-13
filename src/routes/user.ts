import { FastifyPluginAsync } from "fastify";

import db from "../config/db";
import { usersMiddleware, usersMiddleware2 } from "../middleware/users";

const userRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.post('/helloTest', {
        preHandler: [usersMiddleware],
        handler: async (_, reply) => {
            reply.send({ message: 'zxc' })
        }
    })

    fastify.post('/helloTest1', {
        preHandler: [usersMiddleware2],
        handler: async (_, reply) => {
            reply.send({ message: 'zxc' })
        }
    })

    fastify.get('/helloTest1', {
        handler: async (request, reply) => {
            request.log.info({ user: { name: "Umang", surname: "Panchal" } })
            reply.send({ message: 'zxc' })
        }
    })

    fastify.post("/createUser", {
        handler: async (_, res) => {
            try {
                await db("users").insert({ first_name: "Umang", last_name: "Panchal", })
                const user = await db.select("*").from("users")
                res.code(200).send({ users: user })
            } catch (error) {
                if (error instanceof Error) { res.code(500).send({ message: error.message }) }
            }
        }
    });
}

export { userRoutes };