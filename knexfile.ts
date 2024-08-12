import { Knex } from 'knex';

const config: Knex.Config = {
    client: 'pg',
    connection: {
        host: 'postgres_db',
        user: 'root',
        password: 'root',
        database: 'mydb'
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        directory: './migrations'
    },
    seeds: {
        directory: './seeds'
    }
};

export default config;