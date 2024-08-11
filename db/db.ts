import Knex from "knex";

console.log("knexfile_1-process.env.DATABASE_URL==>", process.env.DATABASE_URL);
const db = Knex({
  client: "pg",
  //   connection: process.env.DATABASE_URL,
  connection: {
    host: "postgres_db",
    port: 5432,
    user: "root",
    password: "root",
    database: "mydb",
  },
  searchPath: ["knex", "public"],
  debug: true,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
  },
});

export default db;
