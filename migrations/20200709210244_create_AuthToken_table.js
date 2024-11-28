const utc = { useTz: false };

exports.up = function (knex) {
  return knex.schema
    .withSchema('public')
    .createTable('AuthToken', function (table) {
      table.increments();

      table.timestamp('createdAt_utc', utc);
      table.text('createdAt_offset');

      table.timestamp('updatedAt_utc', utc);
      table.text('updatedAt_offset');

      table.uuid('token');
      table.integer('user');

      table.timestamp('expiresAt_utc', utc);
      table.text('expiresAt_offset');

      table.boolean('valid');

      table.index('user');
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('AuthToken');
};
