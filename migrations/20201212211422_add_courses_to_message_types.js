exports.up = function (knex) {
  return knex.schema.table('MessageType', function (table) {
    table.jsonb('courses');
  });
};

exports.down = function (knex) {
  return knex.schema.table('MessageType', function (table) {
    table.dropColumn('courses');
  });
};
