const utc = { useTz: false };

exports.up = function (knex) {
  return knex.schema
    .withSchema('public')
    .createTable('Order', function (table) {
      table.increments();
      table.timestamp('createdAt_utc', utc);
      table.text('createdAt_offset');
      table.timestamp('updatedAt_utc', utc);
      table.text('updatedAt_offset');
      table.integer('createdBy');
      table.integer('updatedBy');
      table.index('createdBy');
      table.index('updatedBy');
      table.string('stripeSessionId', 256).notNullable();
      table.string('stripeCustomerEmail', 256).notNullable();
      table.string('stripeCustomerId', 256).notNullable();
      table.integer('course').notNullable();
      table.index('course');
      table.unique(['stripeCustomerEmail', 'stripeSessionId']);
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Order');
};
