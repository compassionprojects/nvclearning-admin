exports.up = function (knex) {
  return knex.schema.table('Message', function (table) {
    table.boolean('orphaned');
  });
};

exports.down = function (knex) {
  return knex.schema.table('Message', function (table) {
    table.dropColumn('orphaned');
  });
};
