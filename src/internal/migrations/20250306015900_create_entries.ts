import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
   return knex.schema.createTable("entries", (table) => {
      table.increments("id").primary();
      table.uuid("account_id").references('accounts');
      table.decimal("amount").notNullable().defaultTo(0.00);
      table.timestamp('created_at', { precision: 6 }).defaultTo(knex.fn.now());;
   });
}

export async function down(knex: Knex): Promise<void> {
   return knex.schema.dropTable("entries");
}
