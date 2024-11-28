exports.up = function (knex) {
  return knex.schema.table('Course', function (table) {
    table.string('ticketUrl');
  });
};

exports.down = function (knex) {
  return knex.schema.table('Course', function (table) {
    table.dropColumn('ticketUrl');
  });
};
