import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
   return knex.schema.createTable("transfers", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw('(UUID())'));
      table.decimal("balance").notNullable().defaultTo(0.00);
      table.uuid("sender_id").references('accounts');
      table.uuid("recipient_id").references('accounts');
      table.timestamp('created_at').defaultTo(knex.fn.now());;
   });
}

export async function down(knex: Knex): Promise<void> {
   return knex.schema.dropTable("transfers");
}
