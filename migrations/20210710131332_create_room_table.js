const utc = { useTz: false };

exports.up = function (knex) {
  return knex.schema.withSchema('public').createTable('Room', function (table) {
    table.increments();
    table.string('title', 200).notNullable();
    table.string('link').notNullable();

    table.timestamp('createdAt_utc', utc);
    table.text('createdAt_offset');
    table.timestamp('updatedAt_utc', utc);
    table.text('updatedAt_offset');
    table.integer('createdBy');
    table.integer('updatedBy');
    table.index('createdBy');
    table.index('updatedBy');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Room');
};
