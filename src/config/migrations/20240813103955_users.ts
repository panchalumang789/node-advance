import type { Knex } from 'knex';

import { USER_ROLES } from '../../schema/user';

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

  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('address').notNullable();
    table.string('contact_no').notNullable().unique();
    table.string('password').notNullable();
    table.enum('role', Object.values(USER_ROLES));

    table.timestamps(true, true);
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
  return knex.schema.dropTable('users');
}
