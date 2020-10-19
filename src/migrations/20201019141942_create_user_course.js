exports.up = function (knex) {
  return knex.schema
    .withSchema('public')
    .createTable('User_courses_many', function (table) {
      table.increments();
      table.integer('User_left_id').notNullable();
      table.integer('Course_right_id').notNullable();
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('User_courses_many');
};
