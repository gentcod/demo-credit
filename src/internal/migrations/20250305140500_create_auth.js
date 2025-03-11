exports.up = function(knex) {
   return knex.schema.createTable("auths", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw('(UUID())'));
      table.string("email").unique().notNullable();
      table.string("password").notNullable();
      table.timestamps(true, true);
   });
};

exports.down = function(knex) {
   return knex.schema.dropTable("auths");
};
