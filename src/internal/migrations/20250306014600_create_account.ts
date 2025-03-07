import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
   return knex.schema.createTable("accounts", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw('(UUID())'));
      table.uuid("user_id").references('auths').onDelete("CASCADE");
      table.bigint("balance").notNullable().defaultTo(0.00);
      table.string("account_no", 10).notNullable().unique();
      table.string("currency").notNullable();
      table.timestamps(true, true);
   });
}

export async function down(knex: Knex): Promise<void> {
   return knex.schema.dropTable("profiles");
}
