import { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";

import { readFileStream } from "../streams/readFile";
import { createInterface } from "readline";
import { duplexStream } from "../streams/writeFile";

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

    fastify.post('/', (request: FastifyRequest, reply: FastifyReply) => {
        const rl = createInterface({
            input: duplexStream,
            output: process.stdout,
            prompt: 'fastify'
        });
        // request.body.pipe(writableStream);
        rl.prompt();
        duplexStream.pipe(process.stdout, { end: false });
        duplexStream.on('data', (chunk) => {
            reply.send(chunk.toString());
        });
    });
}

export { streamRoutes }