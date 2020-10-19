const utc = { useTz: false };

exports.up = function (knex) {
  return knex.schema
    .withSchema('public')
    .createTable('Trainer', function (table) {
      table.increments();
      table.timestamp('createdAt_utc', utc);
      table.text('createdAt_offset');
      table.timestamp('updatedAt_utc', utc);
      table.text('updatedAt_offset');
      table.integer('createdBy');
      table.integer('updatedBy');
      table.index('createdBy');
      table.index('updatedBy');
      table.string('name', 200).notNullable();
      table.text('bio').notNullable();
      table.string('avatar_url', 256);
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Trainer');
};
