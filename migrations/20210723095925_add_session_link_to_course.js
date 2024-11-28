exports.up = function (knex) {
  return knex.schema.table('Course', function (table) {
    table.string('communityRoomLink');
  });
};

exports.down = function (knex) {
  return knex.schema.table('Course', function (table) {
    table.dropColumn('communityRoomLink');
  });
};
