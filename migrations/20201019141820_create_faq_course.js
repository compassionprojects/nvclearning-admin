exports.up = function (knex) {
  return knex.schema
    .withSchema('public')
    .createTable('FAQ_courses_many', function (table) {
      table.increments();
      table.integer('FAQ_left_id').notNullable();
      table.integer('Course_right_id').notNullable();
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('FAQ_courses_many');
};
