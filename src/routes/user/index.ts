import { z } from "zod";
import { FastifyPluginAsync } from "fastify";

import { getAllUsersSchema } from "../../utils/user";
import { validateData } from "../../middleware/users";
import { UserController } from "../../controllers/users";


const userRoutes: FastifyPluginAsync = async (app) => {
    const userController = new UserController();

    app.post("/user", {
        schema: {
            tags: ['User'],
            body: z.object({
                first_name: z.string().min(1, "First name is required"),
                last_name: z.string().min(1, "Last name is required"),
            }),
            response: { 200: z.object({ user: getAllUsersSchema }) },
        },
        preHandler: validateData,
        handler: userController.createUser
    })

}

export { userRoutes };