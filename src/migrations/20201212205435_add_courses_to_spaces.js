exports.up = function (knex) {
  return knex.schema.table('Space', function (table) {
    table.jsonb('courses');
  });
};

exports.down = function (knex) {
  return knex.schema.table('Space', function (table) {
    table.dropColumn('courses');
  });
};
