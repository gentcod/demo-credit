exports.up = function(knex) {
   return knex.schema.createTable("entries", (table) => {
      table.bigIncrements('id').primary();
      table.uuid("account_id").references('accounts');
      table.decimal("amount").notNullable().defaultTo(0.00);
      table.timestamp('created_at').defaultTo(knex.fn.now());;
   });
}

exports.down = function(knex) {
   return knex.schema.dropTable("entries");
}
