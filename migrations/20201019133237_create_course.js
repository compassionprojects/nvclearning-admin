const utc = { useTz: false };

exports.up = function (knex) {
  return knex.schema
    .withSchema('public')
    .createTable('Course', function (table) {
      table.increments();
      table.timestamp('createdAt_utc', utc);
      table.text('createdAt_offset');
      table.timestamp('updatedAt_utc', utc);
      table.text('updatedAt_offset');
      table.integer('createdBy');
      table.integer('updatedBy');
      table.index('createdBy');
      table.index('updatedBy');
      table.string('title', 200).notNullable();
      table.text('description').notNullable();
      table.text('about').notNullable();
      table.text('details').notNullable();
      table.string('facebookLink', 200);
      table.timestamp('dateStart_utc', utc).notNullable();
      table.text('dateStart_offset').notNullable();
      table.timestamp('dateEnd_utc', utc).notNullable();
      table.text('dateEnd_offset').notNullable();
      table.jsonb('trainers');
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Course');
};
