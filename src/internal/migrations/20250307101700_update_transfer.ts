import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("transfers", (table) => {
    table.decimal("balance", 18, 2).alter();
    table.renameColumn("balance", "amount");
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("transfers", (table) => {
    table.renameColumn("amount", "balance");
  });
}
