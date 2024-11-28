exports.up = function (knex) {
  return knex.schema
    .withSchema('public')
    .createTable('Session_trainers_many', function (table) {
      table.increments();
      table.integer('Trainer_right_id');
      table.integer('Session_left_id');
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Session_trainers_many');
};
