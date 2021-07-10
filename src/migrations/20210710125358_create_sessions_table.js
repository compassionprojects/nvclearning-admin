const utc = { useTz: false };

exports.up = function (knex) {
  return knex.schema
    .withSchema('public')
    .createTable('Session', function (table) {
      table.increments();
      table.string('title', 200).notNullable();
      table.text('description');
      table.jsonb('attachments');
      table.jsonb('trainers');
      table.string('videoRecordingUrl');
      table.timestamp('date_utc', utc);
      table.text('date_offset');
      table.integer('room');
      table.integer('course').notNullable();

      table.timestamp('createdAt_utc', utc);
      table.text('createdAt_offset');
      table.timestamp('updatedAt_utc', utc);
      table.text('updatedAt_offset');
      table.integer('createdBy');
      table.integer('updatedBy');
      table.index('createdBy');
      table.index('updatedBy');
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Session');
};
