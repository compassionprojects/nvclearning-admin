const utc = { useTz: false };

exports.up = function (knex) {
  return knex.schema
    .withSchema('public')
    .createTable('Content', function (table) {
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
      table.text('description');
      table.string('url', 500);
      table.string('contentType');
      table.integer('librarySection');
      table.integer('space');
      table.string('callToActionTitle');
      table.string('callToActionUrl', 50);
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Content');
};
