exports.up = function (knex) {
  return knex.schema.table('Space', function (table) {
    table.integer('position');
  });
};

exports.down = function (knex) {
  return knex.schema.table('Space', function (table) {
    table.dropColumn('position');
  });
};
