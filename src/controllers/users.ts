import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify"

import db from "../config/db"

export class UserController {
    getAllUsers = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const users = await db("users").select("*")
            if (!users) {
                throw request.server.httpErrors.badRequest('Users not found');
            }
            return reply.code(200).send({ users })
        } catch (error) {
            if (error instanceof Error && error.name === 'NoSuchKey') {
                throw request.server.httpErrors.notFound('Users not found');
            }
            throw error;
        }
    }

    getUserById = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        try {
            const { id } = request.params;
            const user = await db("users").select("*").where({ id }).first()
            if (!user) {
                throw request.server.httpErrors.badRequest('User not found');
            }
            return reply.code(200).send({ user })
        } catch (error) {
            return reply.code(404).send({ message: 'User not found' })
        }
    }

    createUser = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            if (request.validatedData) {
                const [user] = await db("users").insert(request.validatedData).returning("*")
                if (!user) {
                    throw request.server.httpErrors.badRequest('User creation failed');
                }
                return reply.code(200).send({ user })
            } else return reply.code(500).send({ message: 'User data not found' })
        } catch (error) {
            if (error instanceof z.ZodError) {
                return reply.code(400).send({ message: error.issues[0].message });
            } else if (error instanceof Error) {
                return reply.code(500).send({ message: error.message })
            }
        }
    }

    updateUser = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            if (request.validatedData) {
                const { id } = request.params as FastifyRequest<{ Params: { id: string } }>;
                const [user] = await db("users").update(request.validatedData).where({ id }).returning("*")
                if (!user) {
                    throw request.server.httpErrors.badRequest('User update failed');
                }
                return reply.code(200).send({ user })
            } else return reply.code(500).send({ message: 'User data not found' })
        } catch (error) {
            if (error instanceof z.ZodError) {
                return reply.code(400).send({ message: error.issues[0].message });
            } else if (error instanceof Error) {
                return reply.code(500).send({ message: error.message })
            }
        }
    }

    deleteUser = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { id } = request.params as FastifyRequest<{ Params: { id: string } }>;
            const user = await db("users").delete().where({ id })
            if (user) return reply.code(200).send({ message: `${user} user deleted` })
            else return reply.code(500).send({ message: 'User delete failed' })
        } catch (error) {
            if (error instanceof Error) {
                return reply.code(500).send({ message: error.message })
            }
        }
    }
}