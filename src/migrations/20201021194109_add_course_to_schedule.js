exports.up = function (knex) {
  return knex.schema.table('Schedule', function (table) {
    table.integer('course');
    table.index('course');
  });
};

exports.down = function (knex) {
  return knex.schema.table('Schedule', function (table) {
    table.dropIndex('course');
    table.dropColumn('course');
  });
};
