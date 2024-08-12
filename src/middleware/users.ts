import { FastifyReply, FastifyRequest } from "fastify";

const usersMiddleware = (request: FastifyRequest, reply: FastifyReply, next: any) => {
    console.log('users_2-request.body====================>', request.body)
    next({ code: 404, message: "Not found!" });
}

const usersMiddleware2 = (request: FastifyRequest, reply: FastifyReply, next: any) => {
    console.log('users_8-request.body====================>', request.body)
    next();

}


export { usersMiddleware, usersMiddleware2 }