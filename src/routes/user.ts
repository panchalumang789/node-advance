import { z } from "zod";
import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { getAllUsersSchema } from "../utils/user";
import { validateData } from "../middleware/users";
import { UserController } from "../controllers/users";

const userRoutes: FastifyPluginAsync = async (fastify) => {
    const userController = new UserController();

    fastify.withTypeProvider<ZodTypeProvider>().route({
        url: "/users",
        method: "GET",
        schema: {
            response: {
                200: z.object({
                    users: z.array(getAllUsersSchema)
                }),
                400: z.object({ message: z.string() }),
                500: z.object({ message: z.string() }),
            },
        },
        handler: userController.getAllUsers
    })

    fastify.withTypeProvider<ZodTypeProvider>().route({
        url: "/user/:id",
        method: "GET",
        schema: {
            response: {
                200: z.object({
                    user: z.array(getAllUsersSchema)
                }),
                400: z.object({ message: z.string() }),
                500: z.object({ message: z.string() }),
            },
        },
        handler: userController.getUserById
    })

    fastify.withTypeProvider<ZodTypeProvider>().route({
        url: "/user",
        method: "POST",
        schema: {
            response: {
                200: z.object({
                    users: z.array(getAllUsersSchema)
                }),
                400: z.object({ message: z.string() }),
                500: z.object({ message: z.string() }),
            },
        },
        preHandler: validateData,
        handler: userController.createUser
    })

    fastify.withTypeProvider<ZodTypeProvider>().route({
        url: "/user/:id",
        method: "PUT",
        schema: {
            response: {
                200: getAllUsersSchema,
                400: z.object({ message: z.string() }),
                500: z.object({ message: z.string() }),
            },
        },
        preHandler: validateData,
        handler: userController.updateUser
    })

    fastify.withTypeProvider<ZodTypeProvider>().route({
        url: "/user/:id",
        method: "DELETE",
        schema: {
            response: {
                200: z.object({ message: z.string() }),
                400: z.object({ message: z.string() }),
                500: z.object({ message: z.string() }),
            },
        },
        handler: userController.deleteUser
    })
}

export { userRoutes };