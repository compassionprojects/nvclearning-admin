exports.up = function (knex) {
  return knex.schema
    .withSchema('public')
    .createTable('Course_trainers_many', function (table) {
      table.increments();
      table.integer('Course_left_id').notNullable();
      table.integer('Trainer_right_id').notNullable();
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Course_trainers_many');
};
