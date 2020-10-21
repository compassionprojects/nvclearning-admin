exports.up = function (knex) {
  return knex.schema.table('Pricing', function (table) {
    table.integer('peopleEquivalent');
  });
};

exports.down = function (knex) {
  return knex.schema.table('Pricing', function (table) {
    table.dropColumn('peopleEquivalent');
  });
};
