const utc = { useTz: false };

exports.up = function (knex) {
  return knex.schema.table('Session', function (table) {
    table.renameColumn('date_utc', 'startDateTime_utc');
    table.renameColumn('date_offset', 'startDateTime_offset');

    table.timestamp('endDateTime_utc', utc);
    table.text('endDateTime_offset');
  });
};

exports.down = function (knex) {
  return knex.schema.table('Session', function (table) {
    table.renameColumn('startDateTime', 'date');
    table.dropColumn('endDateTime');
  });
};
