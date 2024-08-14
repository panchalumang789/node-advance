import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify"

import db from "../config/db"
import { ValidationDataRequest } from "../utils/user";

export class UserController {
    getAllUsers = async (request: FastifyRequest, res: FastifyReply) => {
        try {
            const users = await db("users").select("*")
            if (users) res.code(200).send({ users })
            else res.code(404).send({ message: 'Users not found' })
        } catch (error) {
            if (error instanceof Error) { res.code(500).send({ message: error.message }) }
        }
    }

    getUserById = async (request: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) => {
        try {
            const { id } = request.params;
            const user = await db("users").select("*").where({ id }).first()
            if (user) res.code(200).send({ user })
            else res.code(404).send({ message: 'User not found' })
        } catch (error) {
            if (error instanceof Error) {
                res.code(500).send({ message: error.message })
            }
        }
    }

    createUser = async (request: ValidationDataRequest, res: FastifyReply,) => {
        try {
            const [user] = await db("users").insert(request.validatedData).returning("*")
            if (user) res.code(200).send({ user })
            else res.code(500).send({ message: 'User creation failed' })
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.code(400).send({ message: error.issues[0].message });
            } else if (error instanceof Error) {
                res.code(500).send({ message: error.message })
            }
        }
    }

    updateUser = async (request: ValidationDataRequest, res: FastifyReply) => {
        try {
            const { id } = request.params as FastifyRequest<{ Params: { id: string } }>;
            const [user] = await db("users").update(request.validatedData).where({ id }).returning("*")
            if (user) res.code(200).send({ user })
            else res.code(500).send({ message: 'User update failed' })
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.code(400).send({ message: error.issues[0].message });
            } else if (error instanceof Error) {
                res.code(500).send({ message: error.message })
            }
        }
    }

    deleteUser = async (request: ValidationDataRequest, res: FastifyReply) => {
        try {
            const { id } = request.params as FastifyRequest<{ Params: { id: string } }>;
            const user = await db("users").delete().where({ id })
            if (user) res.code(200).send({ message: `${user} user deleted` })
            else res.code(500).send({ message: 'User delete failed' })
        } catch (error) {
            if (error instanceof Error) {
                res.code(500).send({ message: error.message })
            }
        }
    }
}