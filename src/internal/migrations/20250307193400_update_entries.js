exports.up = function(knex) {
  return knex.schema.alterTable("entries", (table) => {
    table.string("description").notNullable();
  });
}


exports.down = function(knex) {
  return knex.schema.alterTable("entries", (table) => {
    table.dropColumn("description");
  });
}
