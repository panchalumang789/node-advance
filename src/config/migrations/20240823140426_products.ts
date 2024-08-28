import type { Knex } from 'knex';

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

  await knex.schema.createTable('products', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.string('name').notNullable();
    table.string('imagePath').notNullable().unique();
    table.integer('price').notNullable();

    table.timestamps(true, true);
  });

  await knex.raw(`
    CREATE TRIGGER update_timestamp_users
    BEFORE UPDATE
    ON products
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp();
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('products');
}
