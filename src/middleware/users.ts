import { z } from "zod";
import { FastifyError, FastifyReply } from "fastify";

import { ValidationDataRequest, userSchema } from "../utils/user";

const validateData = (request: ValidationDataRequest, reply: FastifyReply, next: (err?: FastifyError) => void) => {
    if (!request.body) next({ code: "404", name: "Error", message: "User details required" });

    try {
        const data = userSchema.parse(request.body);
        request.validatedData = data;
        next()
    } catch (error) {
        if (error instanceof z.ZodError) {
            const zodError: Record<string, string> = {}
            error.issues.forEach(err => zodError[err.path[0]] = err.message)
            next({ code: "404", name: "Error", message: JSON.stringify(zodError) });
        }
    }
}

export { validateData }