exports.up = function (knex) {
  return knex.schema
    .withSchema('public')
    .createTable('Space_courses_many', function (table) {
      table.increments();
      table.integer('Space_left_id').notNullable();
      table.integer('Course_right_id').notNullable();
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Space_courses_many');
};
