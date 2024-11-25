const utc = { useTz: false };

exports.up = function (knex) {
  return knex.schema.withSchema('public').createTable('User', function (table) {
    table.increments();
    table.timestamp('createdAt_utc', utc);
    table.text('createdAt_offset');
    table.timestamp('updatedAt_utc', utc);
    table.text('updatedAt_offset');
    table.string('name', 200).notNullable();
    table.string('email', 200).notNullable();
    table.boolean('isAdmin');
    table.string('password').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Space');
};
