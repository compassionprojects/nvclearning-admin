exports.up = function (knex) {
  return knex.schema.alterTable('MessageType', function (t) {
    // increase char limit from 15 to 30
    t.string('title', 30).notNullable().alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('MessageType', function (t) {
    // back to prev value
    t.string('title', 15).notNullable().alter();
  });
};
