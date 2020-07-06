require('dotenv').config();

const { DATABASE_URL, NODE_ENV } = process.env;
const connection = DATABASE_URL.includes('ssl=true')
  ? DATABASE_URL
  : DATABASE_URL + '?ssl=true';

module.exports = {
  client: 'pg',
  connection: NODE_ENV === 'development' ? DATABASE_URL : connection,
  seeds: {
    directory: './seeds/dev',
  },
  migrations: {
    directory: './migrations',
  },
};
