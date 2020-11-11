exports.up = function (knex) {
  return knex.schema.table('User', function (table) {
    const utc = { useTz: false };
    table.timestamp('lastLogin_utc', utc);
    table.text('lastLogin_offset');
  });
};

exports.down = function (knex) {
  return knex.schema.table('User', function (table) {
    table.dropColumn('lastLogin_utc');
    table.dropColumn('lastLogin_offset');
  });
};
