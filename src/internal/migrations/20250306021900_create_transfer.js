exports.up = function(knex) {
   return knex.schema.createTable("transfers", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw('(UUID())'));
      table.decimal("balance").notNullable().defaultTo(0.00);
      table.uuid("sender_id").references('accounts');
      table.uuid("recipient_id").references('accounts');
      table.timestamp('created_at').defaultTo(knex.fn.now());;
   });
}

exports.down = function(knex) {
   return knex.schema.dropTable("transfers");
}
