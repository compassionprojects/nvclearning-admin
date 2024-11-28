exports.up = function (knex) {
  return knex.schema.table('User', function (table) {
    table.boolean('disabled');
  });
};

exports.down = function (knex) {
  return knex.schema.table('User', function (table) {
    table.dropColumn('disabled');
  });
};
