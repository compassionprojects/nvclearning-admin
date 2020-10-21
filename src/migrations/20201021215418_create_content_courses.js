exports.up = function (knex) {
  return knex.schema
    .withSchema('public')
    .createTable('Content_courses_many', function (table) {
      table.increments();
      table.integer('Content_left_id').notNullable();
      table.integer('Course_right_id').notNullable();
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Content_courses_many');
};
