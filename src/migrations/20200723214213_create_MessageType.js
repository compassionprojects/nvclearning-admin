const utc = { useTz: false };

exports.up = function (knex) {
  return knex.schema
    .withSchema('public')
    .createTable('MessageType', function (table) {
      table.increments();
      table.timestamp('createdAt_utc', utc);
      table.text('createdAt_offset');
      table.timestamp('updatedAt_utc', utc);
      table.text('updatedAt_offset');
      table.integer('createdBy');
      table.integer('updatedBy');
      table.index('createdBy');
      table.index('updatedBy');
      table.string('title', 15).notNullable();
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('MessageType');
};
