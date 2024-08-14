import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
        CREATE OR REPLACE FUNCTION update_timestamp()
        RETURNS TRIGGER
        LANGUAGE plpgsql
        AS
        $$
        BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
        END;
        $$;
    `);

    await knex.schema.createTable("users", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string("first_name").notNullable();
        table.string("last_name").notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });

    await knex.raw(`
        CREATE TRIGGER update_timestamp_users
        BEFORE UPDATE
        ON users
        FOR EACH ROW
        EXECUTE PROCEDURE update_timestamp();
    `);
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("users");
}