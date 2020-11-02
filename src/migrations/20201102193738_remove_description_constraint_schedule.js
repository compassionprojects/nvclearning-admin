exports.up = function (knex) {
  return knex.schema.alterTable('Schedule', function (t) {
    // make it nullable
    t.text('description').nullable().alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Schedule', function (t) {
    // back to prev value
    t.text('description').notNullable();
  });
};
