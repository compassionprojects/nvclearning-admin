const utc = { useTz: false };

exports.up = function (knex) {
  return knex.schema
    .withSchema('public')
    .createTable('Pricing', function (table) {
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
      table.integer('price').notNullable();
      table.integer('course').notNullable();
      table.index('course');
      table.string('currency', 50).notNullable();
      table.string('stripePriceId', 200).notNullable();
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Pricing');
};
