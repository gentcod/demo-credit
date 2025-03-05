import { Knex } from 'knex';
import { v4 as uuidv4 } from "uuid";

export async function up(knex: Knex): Promise<void> {
   return knex.schema.createTable("profiles", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw('(UUID())'));
      table.uuid("user_id").references('auths');
      table.string("first_name").notNullable();
      table.string("last_name").notNullable();
      table.timestamps(true, true);
   });
}

export async function down(knex: Knex): Promise<void> {
   return knex.schema.dropTable("profiles");
}
