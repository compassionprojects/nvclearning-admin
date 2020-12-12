exports.up = function (knex) {
  return knex.schema
    .withSchema('public')
    .createTable('LibrarySection_courses_many', function (table) {
      table.increments();
      table.integer('LibrarySection_left_id').notNullable();
      table.integer('Course_right_id').notNullable();
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('LibrarySection_courses_many');
};
