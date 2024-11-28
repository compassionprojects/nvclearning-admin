exports.up = function (knex) {
  return knex.schema
    .withSchema('public')
    .createTable('Message_replies_many', function (table) {
      table.increments();
      table.integer('Message_left_id').notNullable();
      table.integer('Message_right_id').notNullable();
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Message_replies_many');
};
