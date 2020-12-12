exports.up = function (knex) {
  return knex.schema
    .withSchema('public')
    .createTable('MessageType_courses_many', function (table) {
      table.increments();
      table.integer('MessageType_left_id').notNullable();
      table.integer('Course_right_id').notNullable();
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('MessageType_courses_many');
};
