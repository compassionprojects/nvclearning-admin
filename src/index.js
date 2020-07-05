require('dotenv').config();

const { Keystone } = require('@keystonejs/keystone');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { KnexAdapter: Adapter } = require('@keystonejs/adapter-knex');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { User } = require('./schema');

const PROJECT_NAME = 'vic';
const knexOptions = require('./knexfile');
const adapterConfig = { knexOptions };

/**
 * You've got a new KeystoneJS Project! Things you might want to do next:
 * - Add adapter config options (See: https://keystonejs.com/keystonejs/adapter-mongoose/)
 * - Select configure access control and authentication (See: https://keystonejs.com/api/access-control)
 */

const keystone = new Keystone({
  name: PROJECT_NAME,
  cookieSecret: process.env.COOKIE_SECRET,
  adapter: new Adapter(adapterConfig),
});

// create our app entities / data structure
keystone.createList('User', User);

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User'
});

module.exports = {
  keystone,
  apps: [new GraphQLApp(), new AdminUIApp({
    enableDefaultRoute: false,
    authStrategy,
    isAccessAllowed: ({ authentication: { item: user } }) => !!user && !!user.isAdmin
  })],
};
