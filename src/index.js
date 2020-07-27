require('dotenv').config();

const session = require('express-session');
const { Keystone } = require('@keystonejs/keystone');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { KnexAdapter: Adapter } = require('@keystonejs/adapter-knex');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const {
  User,
  Space,
  LibrarySection,
  Content,
  Schedule,
  Card,
  Message,
  MessageType,
} = require('./schema');

const PROJECT_NAME = 'vic';
const VICApp = require('./vic');
const knexOptions = require('./knexfile');
const adapterConfig = { knexOptions };
const KnexSessionStore = require('connect-session-knex')(session);
const isProduction = process.env.NODE_ENV === 'production';

// Init keystone
const keystone = new Keystone({
  name: PROJECT_NAME,
  cookieSecret: process.env.COOKIE_SECRET,
  cookie: {
    secure: isProduction,
  },
  adapter: new Adapter(adapterConfig),
  sessionStore: new KnexSessionStore({
    knex: require('knex')(knexOptions),
    tablename: 'user_sessions', // optional. Defaults to 'sessions'
  }),
});

// create our app entities
keystone.createList('User', User);
keystone.createList('Space', Space);
keystone.createList('LibrarySection', LibrarySection);
keystone.createList('Content', Content);
keystone.createList('Schedule', Schedule);
keystone.createList('Card', Card);
keystone.createList('Message', Message);
keystone.createList('MessageType', MessageType);

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
});

const cors = { origin: process.env.SERVER_URL, credentials: true };

module.exports = {
  keystone,
  cors,
  apps: [
    new VICApp(),
    new GraphQLApp({ apollo: { cors } }),
    new AdminUIApp({
      enableDefaultRoute: false,
      authStrategy,
      isAccessAllowed: ({ authentication: { item: user } }) =>
        !!user && !!user.isAdmin,
    }),
  ],
  configureExpress: (app) => app.set('trust proxy', 1),
};
