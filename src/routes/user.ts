import { FastifyPluginAsync } from "fastify";

import { validateData } from "../middleware/users";
import { UserController } from "../controllers/users";

const userRoutes: FastifyPluginAsync = async (fastify) => {
    const userController = new UserController();

    fastify.get('/users', { handler: userController.getAllUsers })

    fastify.get("/user/:id", { handler: userController.getUserById });

    fastify.post("/user", { preHandler: [validateData], handler: userController.createUser });

    fastify.put("/user/:id", { preHandler: [validateData], handler: userController.updateUser });

    fastify.delete("/user/:id", { handler: userController.deleteUser });
}

export { userRoutes };