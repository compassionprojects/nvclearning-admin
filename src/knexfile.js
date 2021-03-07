require('dotenv').config();

module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL + '?sslmode=require',
  seeds: {
    directory: './seeds/dev',
  },
  migrations: {
    directory: './migrations',
  },
};
