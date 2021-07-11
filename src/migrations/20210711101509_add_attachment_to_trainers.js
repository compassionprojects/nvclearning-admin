exports.up = function (knex) {
  return knex.schema.table('Trainer', function (table) {
    table.integer('attachment');
  });
};

exports.down = function (knex) {
  return knex.schema.table('Trainer', function (table) {
    table.dropColumn('attachment');
  });
};
