const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, salt);
const createdAt_utc = new Date().toISOString();
const createdAt_offset = '+00:00';

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('User').del();

  await knex('User').insert([
    {
      name: 'Admin',
      email: process.env.ADMIN_EMAIL,
      password: hash,
      isAdmin: true,
      createdAt_utc,
      createdAt_offset,
      updatedAt_utc: createdAt_utc,
      updatedAt_offset: createdAt_offset,
    },
  ]);
};
