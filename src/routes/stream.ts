import { FastifyPluginAsync } from "fastify";

import { readFileStream } from "../streams/readFile";

const streamRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.get("/readfile-stream", (_, res) => {
        try {
            readFileStream().on('line', (line) => {
                if (line.includes("Streams") || line.includes("Streams".toLocaleLowerCase())) {
                    res.log.info(line)
                }
            })

            readFileStream().on('close', () => {
                res.status(200).send({ hello: "Read file stream closed" });
            });
        } catch (error) {
            if (error instanceof Error) {
                res.log.error(error.message)
                res.code(500).send({ message: 'Internal server error.' })
            }
        }
    });
}

export { streamRoutes }