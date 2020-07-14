const {
  Text,
  Relationship,
  DateTime,
  Checkbox,
  Password,
  Uuid,
} = require('@keystonejs/fields');
const { atTracking /* byTracking */ } = require('@keystonejs/list-plugins');
const { v4: uuid } = require('uuid');
const { signin } = require('./emails');

// const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');
// const { graphql } = require('graphql');

/**
 * Access control
 */

const userIsAdmin = ({ authentication: { item: user } }) =>
  Boolean(user && user.isAdmin);
const userIsAuthenticated = ({ authentication: { item } }) => !!item;

const dateFormat = { format: 'dd/MM/yyyy h:mm a' };
const plugins = [atTracking(dateFormat)];

/**
 * Schemas
 */

exports.User = {
  access: {
    create: userIsAdmin,
    read: userIsAuthenticated,
    update: userIsAdmin,
    delete: userIsAdmin,
  },
  fields: {
    name: { type: Text },
    email: {
      type: Text,
      isUnique: true,
      isRequired: true,
      access: { read: userIsAuthenticated },
    },
    isAdmin: { type: Checkbox },
    password: {
      type: Password,
    },
  },
  plugins,
};

exports.AuthToken = {
  access: {
    create: true,
    read: true,
    update: userIsAdmin,
    delete: userIsAdmin,
  },
  fields: {
    user: {
      type: Relationship,
      ref: 'User',
      // access: { read: userIsAdmin },
    },
    token: {
      type: Uuid,
      isRequired: true,
      isUnique: true,
      access: { read: userIsAdmin, update: false },
    },
    expiresAt: {
      type: DateTime,
      isRequired: true,
      access: { read: userIsAdmin, update: false },
    },
    invalid: { type: Checkbox, defaultValue: false },
  },
  plugins,
  hooks: {
    afterChange: async ({ context, updatedItem, existingItem }) => {
      if (existingItem) return null;

      const now = new Date().toISOString();

      const { errors, data } = await context.executeGraphQL({
        context: context.createContext({ skipAccessControl: true }),
        query: `
        query GetUserAndToken($user: ID!, $now: DateTime!) {
          user: User( where: { id: $user }) {
            id
            name
            email
          }
          allAuthTokens( where: { user: { id: $user }, expiresAt_gte: $now, invalid: false }) {
            token
            expiresAt
          }
        }
      `,
        variables: { user: updatedItem.user.toString(), now },
      });

      if (errors) {
        console.error(errors, 'Unable to construct magic sign-in email.');
        return;
      }

      const { allAuthTokens, user } = data;
      const authToken = allAuthTokens[0].token;
      const url = process.env.SERVER_URL || 'http://localhost:4000';

      signin({
        to: user.email,
        subject: 'Sign in to VIC Peacefactory',
        name: user.name,
        magicLink: `${url}/signin?token=${authToken}`,
      });
    },
  },
};

exports.customSchema = {
  mutations: [
    {
      schema: 'startMagicSignIn(email: String!): AuthToken',
      resolver: async (obj, { email }, context) => {
        const token = uuid();

        const tokenExpiration =
          parseInt(process.env.AUTH_TOKEN_EXPIRY) || 1000 * 60 * 60 * 24;

        const now = Date.now();
        const expiresAt = new Date(now + tokenExpiration).toISOString();

        const {
          errors: userErrors,
          data: userData,
        } = await context.executeGraphQL({
          context: context.createContext({ skipAccessControl: true }),
          query: `
            query findUserByEmail($email: String!) {
              allUsers(where: { email: $email }) {
                id
                email
              }
            }
          `,
          variables: { email: email },
        });

        if (userErrors || !userData.allUsers || !userData.allUsers.length) {
          const errMsgNoUser =
            'Unable to find user when trying to the create magic sign-in link.';
          console.error(userErrors, errMsgNoUser);
          throw new Error(errMsgNoUser);
        }

        const userId = userData.allUsers[0].id;

        const result = {
          userId,
          token,
          expiresAt,
        };

        const { errors, data } = await context.executeGraphQL({
          context,
          query: `
            mutation createAuthToken(
              $userId: ID!,
              $token: String,
              $expiresAt: DateTime,
            ) {
              authToken: createAuthToken(data: {
                user: { connect: { id: $userId }},
                token: $token,
                expiresAt: $expiresAt,
              }) {
                id
                token
                invalid
                user {
                  id
                  name
                  email
                  createdAt
                  updatedAt
                  password_is_set
                  isAdmin
                }
                expiresAt
                createdAt
                updatedAt
              }
            }
          `,
          variables: result,
        });

        if (errors) {
          console.error(errors, 'Unable to create auth token.');
          throw errors.message;
        }

        return data.authToken;
      },
    },
    {
      schema: 'invalidateToken(token: String!): AuthToken',
      resolver: async (obj, { token }, context) => {
        const now = new Date().toISOString();

        const { errors, data } = await context.executeGraphQL({
          context: context.createContext({ skipAccessControl: true }),
          query: `
            query findUserFromToken($token: String!, $now: DateTime!) {
              authTokens: allAuthTokens(where: { token: $token, expiresAt_gte: $now }) {
                id
                token
                invalid
                expiresAt
                user {
                  id
                }
              }
            }`,
          variables: { token, now },
        });

        if (errors) {
          console.error(errors, 'Unable to find user with the given token');
          throw errors.message;
        }

        if (!data.authTokens.length) {
          const msg =
            'No users found for the given token. Probably it has expired';
          console.error(errors, msg);
          throw msg;
        }

        const tokenId = data.authTokens[0].id;

        const { errors: err, updatedItem } = await context.executeGraphQL({
          context: context.createContext({ skipAccessControl: true }),
          query: `mutation updateAuthToken($tokenId: ID!): AuthToken {
            updatedItem: updateAuthToken(id: $tokenId, data: { invalid: true }) {
              id
            }
          }
        `,
          variables: { tokenId },
        });

        if (err) {
          console.error(err, 'Unable to invalidate auth token');
          throw errors.message;
        }

        return updatedItem;
      },
    },
  ],
};
