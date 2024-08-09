import Fastify from 'fastify'
import knex from './knexfile';

const fastify = Fastify({ logger: true })

fastify.register(knex);

fastify.register(require('./routes/user'), {
    logLevel: 'info',
    logSerializers: {
        user: (value) => `My serializer two - ${value.name} ${value.surname}`
    }
})


// Declare a route
fastify.get('/', (req, res) => {
    res.status(200).send({ hello: 'world' })
})

fastify.get('/users', (request, reply) => {
    reply.send({ hello: 'asdasdas' })
})

// Run the server!
fastify.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    fastify.log.info(`server listening on ${address}`)
})