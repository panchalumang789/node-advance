import Knex from 'knex';

const knex = Knex({
    client: 'pg',
    connection: {
        host: 'postgres_db',
        port: 5432,
        user: 'root',
        password: 'root',
        database: 'mydb',
    },
    searchPath: ['knex', 'public'],
    debug: true
});

export default knex;