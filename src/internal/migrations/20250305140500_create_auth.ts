import { Knex } from 'knex';
import { v4 as uuidv4 } from "uuid";
import { IAuth } from "../../models/Auth";

export async function up(knex: Knex): Promise<void> {
   return knex.schema.createTable("auths", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw(`'${uuidv4()}'`));
      table.string("email").unique().notNullable();
      table.string("password").notNullable();
      table.timestamps(true, true);
   });
}

export async function down(knex: Knex): Promise<void> {
   return knex.schema.dropTable("auths");
}
