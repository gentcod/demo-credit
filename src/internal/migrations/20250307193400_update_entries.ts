import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("entries", (table) => {
    table.string("description").notNullable();
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("entries", (table) => {
    table.dropColumn("description");
  });
}
