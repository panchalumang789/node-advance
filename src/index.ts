import Fastify from "fastify";
import knex from "knex";
import config from "../knexfile";

const fastify = Fastify({ logger: true });

const db = knex(config)

fastify.register(require("./routes/user"), {
  logLevel: "info",
  logSerializers: {
    user: (value) => `My serializer two - ${value.name} ${value.surname}`,
  },
});

// Declare a route
fastify.get("/", (req, res) => {
  res.status(200).send({ hello: "world" });
});

fastify.post("/createUser", (req, res) => {
  db("users")
    .insert({
      first_name: "Umang",
      last_name: "Panchal",
    })
    .then(() => {
      db
        .select("*")
        .from("users")
        .then((users) => {
          res.send(users);
        });
    });
});

fastify.get("/users", (request, reply) => {
  reply.send({ hello: "asdasdas" });
});

fastify.setErrorHandler((error, request, reply) => {
  const { code, message } = error;
  reply.code(+code || 500).send({ message: message });
});

// Run the server!
fastify.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});
