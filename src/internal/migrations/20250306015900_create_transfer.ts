import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
   return knex.schema.createTable("transfers", (table) => {
      table.increments("id").primary();
      table.decimal("balance").notNullable().defaultTo(0.00);
      table.uuid("sender_id").references('accounts');
      table.uuid("recipient_id").references('accounts');
      table.timestamp('created_at', { precision: 6 }).defaultTo(knex.fn.now());;
   });
}

export async function down(knex: Knex): Promise<void> {
   return knex.schema.dropTable("transfers");
}
