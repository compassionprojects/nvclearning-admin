const utc = { useTz: false };

exports.up = function (knex) {
  return knex.schema
    .withSchema('public')
    .createTable('Message', function (table) {
      table.increments();
      table.timestamp('createdAt_utc', utc);
      table.text('createdAt_offset');
      table.timestamp('updatedAt_utc', utc);
      table.text('updatedAt_offset');
      table.integer('createdBy');
      table.integer('updatedBy');
      table.index('createdBy');
      table.index('updatedBy');
      table.text('body').notNullable();
      table.integer('type').notNullable();
      table.jsonb('replies');
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Message');
};
