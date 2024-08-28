import type { Knex } from 'knex';
import { PaymentType } from '../../schema/payments';

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

  await knex.schema.createTable('payments', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.integer('amount').notNullable();
    table.enum('paymentType', Object.values(PaymentType));

    table.uuid('order_id').references('id').inTable('orders');

    table.timestamps(true, true);
  });

  await knex.raw(`
    CREATE TRIGGER update_timestamp_users
    BEFORE UPDATE
    ON payments
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp();
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('payments');
}
