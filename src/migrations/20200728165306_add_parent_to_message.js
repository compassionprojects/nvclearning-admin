exports.up = function (knex) {
  return knex.schema.table('Message', function (table) {
    table.integer('parent');
  });
};

exports.down = function (knex) {
  return knex.schema.table('Message', function (table) {
    table.dropColumn('parent');
  });
};
