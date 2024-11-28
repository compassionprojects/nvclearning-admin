exports.up = function (knex) {
  return knex.schema.table('User', function (table) {
    table.string('language');
  });
};

exports.down = function (knex) {
  return knex.schema.table('User', function (table) {
    table.dropColumn('language');
  });
};
