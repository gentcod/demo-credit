import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("accounts", (table) => {
    table.renameColumn("account_no", "wallet_id");
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("accounts", (table) => {
    table.renameColumn("wallet_id", "account_no");
  });
}
