require('dotenv').config();

const session = require('express-session');
const { Keystone } = require('@keystonejs/keystone');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { KnexAdapter: Adapter } = require('@keystonejs/adapter-knex');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const {
  User,
  AuthToken,
  customSchema,
  Space,
  LibrarySection,
  Content,
  Schedule,
  Card,
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
keystone.createList('AuthToken', AuthToken);
keystone.createList('Space', Space);
keystone.createList('LibrarySection', LibrarySection);
keystone.createList('Content', Content);
keystone.createList('Schedule', Schedule);
keystone.createList('Card', Card);
keystone.extendGraphQLSchema(customSchema);

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
});

module.exports = {
  keystone,
  apps: [
    new VICApp(keystone),
    new GraphQLApp(),
    new AdminUIApp({
      enableDefaultRoute: false,
      authStrategy,
      isAccessAllowed: ({ authentication: { item: user } }) =>
        !!user && !!user.isAdmin,
    }),
  ],
  configureExpress: (app) => {
    app.set('trust proxy', 1);
  },
};
