exports.up = function (knex) {
  return knex.schema.table('User', function (table) {
    table.text('authToken');
  });
};

exports.down = function (knex) {
  knex.schema.table('User', function (table) {
    table.dropColumn('authToken');
  });
};
