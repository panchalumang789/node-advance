import { Knex } from 'knex';

console.log('knexfile_3-__dirname==>', __dirname)
const config: Knex.Config = {
    client: 'pg',
    connection: {
        host: 'localhost',
        // host: 'postgres_db',
        // port: 5432,
        user: 'root',
        password: 'root',
        database: 'mydb'
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        directory: __dirname + '/migrations'
    },
    seeds: {
        directory: __dirname + '/seeds'
    }
};

export default config;