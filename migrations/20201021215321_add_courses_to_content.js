exports.up = function (knex) {
  return knex.schema.table('Content', function (table) {
    table.jsonb('courses');
  });
};

exports.down = function (knex) {
  return knex.schema.table('Content', function (table) {
    table.dropColumn('courses');
  });
};
