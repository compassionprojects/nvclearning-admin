exports.up = function (knex) {
  return knex.schema.table('LibrarySection', function (table) {
    table.jsonb('courses');
  });
};

exports.down = function (knex) {
  return knex.schema.table('LibrarySection', function (table) {
    table.dropColumn('courses');
  });
};
