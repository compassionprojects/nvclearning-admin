exports.up = function (knex) {
  return knex.schema.table('User', function (table) {
    table.jsonb('courses');
  });
};

exports.down = function (knex) {
  return knex.schema.table('User', function (table) {
    table.dropColumn('courses');
  });
};
