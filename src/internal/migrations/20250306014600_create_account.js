exports.up = function(knex) {
   return knex.schema.createTable("accounts", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw('(UUID())'));
      table.uuid("user_id").references('auths');
      table.bigint("balance").notNullable().defaultTo(0.00);
      table.string("account_no", 10).notNullable().unique();
      table.string("currency").notNullable();
      table.timestamps(true, true);
   });
}

exports.down = function(knex) {
   return knex.schema.dropTable("profiles");
}
