exports.up = function (knex) {
  return knex.schema.table('Course', function (table) {
    table.string('videoUrl');
  });
};

exports.down = function (knex) {
  return knex.schema.table('Course', function (table) {
    table.dropColumn('videoUrl');
  });
};
