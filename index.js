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
  Course,
  Trainer,
  Pricing,
  Order,
  FAQ,
  Attachment,
  Session,
  Room,
} = require('./schema');
const { APP_NAME } = require('./constants');

const Auth = require('./auth');
const knexOptions = require('./knexfile');
const adapterConfig = { knexOptions };
const KnexSessionStore = require('connect-session-knex')(session);
const isProduction = process.env.NODE_ENV === 'production';

// Init keystone
const keystone = new Keystone({
  name: APP_NAME,
  cookieSecret: process.env.COOKIE_SECRET,
  cookie: {
    secure: isProduction,
  },
  adapter: new Adapter(adapterConfig),
  sessionStore:
    process.env.BUILD_STAGE !== undefined
      ? undefined
      : new KnexSessionStore({
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
keystone.createList('Course', Course);
keystone.createList('Trainer', Trainer);
keystone.createList('Pricing', Pricing);
keystone.createList('Order', Order);
keystone.createList('FAQ', FAQ);
keystone.createList('Attachment', Attachment);
keystone.createList('Session', Session);
keystone.createList('Room', Room);

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
});

const cors = {
  origin: [
    process.env.SERVER_URL,
    // process.env.SERVER_URL.replace('https', 'http'), // don't support cors over http
  ],
  credentials: true,
};

module.exports = {
  keystone,
  cors,
  apps: [
    new Auth(),
    new GraphQLApp({ apollo: { cors } }),
    new AdminUIApp({
      name: 'NVC Learning Admin',
      enableDefaultRoute: false,
      authStrategy,
      isAccessAllowed: ({ authentication: { item: user } }) =>
        !!user && !!user.isAdmin && !user.disabled,
    }),
  ],
  configureExpress: (app) => app.set('trust proxy', 1),
};
