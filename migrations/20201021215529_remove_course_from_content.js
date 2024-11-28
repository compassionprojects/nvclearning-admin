exports.up = function (knex) {
  return knex.schema.table('Content', function (table) {
    table.dropColumn('course');
  });
};

exports.down = function (knex) {
  return knex.schema.table('Content', function (table) {
    table.integer('course');
  });
};
