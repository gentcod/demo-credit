exports.up = function(knex) {
  return knex.schema.alterTable("transfers", (table) => {
    table.decimal("balance", 18, 2).alter();
    table.renameColumn("balance", "amount");
  });
}


exports.down = function(knex) {
  return knex.schema.alterTable("transfers", (table) => {
    table.renameColumn("amount", "balance");
  });
}
