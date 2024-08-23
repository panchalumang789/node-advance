import type { Knex } from 'knex';
import { PaymentStatus } from '../../schema/orders';

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

  await knex.schema.createTable('orders', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.enum('paymentStatus', Object.values(PaymentStatus));
    table.string('payments').notNullable();
    table.string('userId').notNullable();

    table.timestamps(true, true);
  });

  await knex.raw(`
    CREATE TRIGGER update_timestamp_users
    BEFORE UPDATE
    ON orders
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp();
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('orders');
}
