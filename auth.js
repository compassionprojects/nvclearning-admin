const express = require('express');
const passport = require('passport');
const cors = require('cors');
const MagicLinkStrategy = require('passport-magic-link').Strategy;

const { signin } = require('./emails');
const { gql } = require('apollo-server-express');

module.exports = class Auth {
  prepareMiddleware({ keystone }) {
    const app = express();

    passport.use(
      new MagicLinkStrategy(
        {
          secret: process.env.TOKEN_SECRET,
          userFields: ['email'],
          tokenField: 'token',
          ttl: process.env.AUTH_TOKEN_EXPIRY,
        },
        sendToken,
        (user) => verifyUser(user, keystone)
      )
    );

    app.use(
      cors({
        origin: [
          process.env.SERVER_URL,
          process.env.SERVER_URL.replace('https', 'http'),
        ],
        credentials: true,
      })
    );
    app.use(passport.initialize());

    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));

    app.use((req, res, next) => {
      if (!req.query.token) return next();
      passport.authenticate('magiclink', {
        action: 'acceptToken',
        allowReuse: true,
      })(req, res, next);
    });

    app.use(async (req, res, next) => {
      if (!req.user) return next();
      if (req.user && req.user.isAdmin) return next();

      const query = gql`
        query User($id: ID!) {
          User(where: { id: $id }) {
            id
            email
            name
            language
          }
        }
      `;

      const context = keystone.createContext({ skipAccessControl: true });
      const { data, errors } = await keystone.executeGraphQL({
        context,
        query,
        variables: { id: req.user.id },
      });

      if (errors) return next(errors.message);

      // returns a token
      await keystone._sessionManager.startAuthedSession(req, {
        item: data.User,
        list: keystone.lists['User'],
      });

      next();
    });

    app.post(
      '/auth/magiclink',
      passport.authenticate('magiclink', { action: 'requestToken' }),
      (req, res) => res.json({ ok: true })
    );

    app.get(
      '/auth/magiclink/callback',
      passport.authenticate('magiclink', {
        action: 'acceptToken',
        allowReuse: true,
      }),
      async (req, res) => {
        if (req.user) {
          const query = gql`
            mutation updateUser($id: ID!, $lastLogin: DateTime) {
              updateUser(id: $id, data: { lastLogin: $lastLogin }) {
                id
              }
            }
          `;

          const context = keystone.createContext({ skipAccessControl: true });
          const { errors } = await keystone.executeGraphQL({
            context,
            query,
            variables: { id: req.user.id, lastLogin: new Date().toISOString() },
          });
          if (errors) {
            console.log('Unable to update last login');
          }
        }
        res.json({ ok: true });
      }
    );

    return app;
  }
};

function sendToken(user, token) {
  const url = process.env.SERVER_URL || 'http://localhost:4000';
  signin({
    user,
    magicLink: `${url}/auth?token=${token}`,
  });
}

async function verifyUser(user, keystone) {
  const context = keystone.createContext({ skipAccessControl: true });
  const { data, errors } = await keystone.executeGraphQL({
    context,
    query: gql`
      query findUser($email: String) {
        allUsers(where: { email: $email }) {
          id
          email
          name
          language
        }
      }
    `,
    variables: { email: user.email },
  });
  const msg = 'Cannot find the user with given email';
  if (errors || !data) {
    console.error(errors);
    return Promise.reject(msg);
  }
  const [usr] = data.allUsers || [];
  if (!usr) return Promise.reject(msg);
  return Promise.resolve(usr);
}
