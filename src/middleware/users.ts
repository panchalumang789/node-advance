import { FastifyReply, FastifyRequest } from "fastify";

const usersMiddleware = (request: FastifyRequest, reply: FastifyReply, next: any) => {
    console.log('users_2-request.body====================>',)
    next();

}

const usersMiddleware2 = (request: FastifyRequest, reply: FastifyReply, next: any) => {
    console.log('users_8-request.body====================>',)
    next();

}


export { usersMiddleware, usersMiddleware2 }