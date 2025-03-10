exports.up = function(knex) {
  return knex.schema.alterTable("accounts", (table) => {
    table.renameColumn("account_no", "wallet_id");
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable("accounts", (table) => {
    table.renameColumn("wallet_id", "account_no");
  });
};
