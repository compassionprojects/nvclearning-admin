exports.up = function (knex) {
  return knex.schema.table('Course', function (table) {
    table.boolean('cancelled');
  });
};

exports.down = function (knex) {
  return knex.schema.table('Course', function (table) {
    table.dropColumn('cancelled');
  });
};
