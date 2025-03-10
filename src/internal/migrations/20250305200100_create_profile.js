exports.up =  function(knex) {
   return knex.schema.createTable("profiles", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw('(UUID())'));
      table.uuid("user_id").references('auths');
      table.string("first_name").notNullable();
      table.string("last_name").notNullable();
      table.timestamps(true, true);
   });
};

exports.down =  function(knex) {
   return knex.schema.dropTable("profiles");
};
