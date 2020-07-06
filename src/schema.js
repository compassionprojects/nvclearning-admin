const {
  Text,
  Relationship,
  DateTime,
  Checkbox,
  Password,
} = require('@keystonejs/fields');
const { atTracking /* byTracking */ } = require('@keystonejs/list-plugins');
const { v4: uuid } = require('uuid');
const sendEmail = require('./emails');

// const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');
// const { graphql } = require('graphql');

/**
 * Access control
 */

const userIsAdmin = ({ authentication: { item: user } }) =>
  Boolean(user && user.isAdmin);
const userIsAuthenticated = ({ authentication: { item } }) => !!item;
const access = {
  userIsAdmin,
  userIsAuthenticated,
};

const dateFormat = { format: 'dd/MM/yyyy h:mm a' };
const plugins = [atTracking(dateFormat)];

/**
 * Schemas
 */

exports.User = {
  fields: {
    name: { type: Text },
    email: {
      type: Text,
      isUnique: true,
      isRequired: true,
    },
    isAdmin: { type: Checkbox },
    password: {
      type: Password,
    },
  },
  plugins,
};

exports.ForgottenPasswordToken = {
  access: {
    create: true,
    read: true,
    update: access.userIsAdmin,
    delete: access.userIsAdmin,
  },
  fields: {
    user: {
      type: Relationship,
      ref: 'User',
      access: {
        read: access.userIsAdmin,
      },
    },
    token: {
      type: Text,
      isRequired: true,
      isUnique: true,
      access: {
        read: access.userIsAdmin,
      },
    },
    requestedAt: { type: DateTime, isRequired: true },
    accessedAt: { type: DateTime },
    expiresAt: { type: DateTime, isRequired: true },
  },
  hooks: {
    afterChange: async ({ context, updatedItem, existingItem }) => {
      if (existingItem) return null;

      const now = new Date().toISOString();

      const { errors, data } = await context.executeGraphQL({
        context: context.createContext({ skipAccessControl: true }),
        query: `
        query GetUserAndToken($user: ID!, $now: DateTime!) {
          User( where: { id: $user }) {
            id
            email
          }
          allForgottenPasswordTokens( where: { user: { id: $user }, expiresAt_gte: $now }) {
            token
            expiresAt
          }
        }
      `,
        variables: { user: updatedItem.user.toString(), now },
      });

      if (errors) {
        console.error(errors, 'Unable to construct password updated email.');
        return;
      }

      const { allForgottenPasswordTokens, User } = data;
      const forgotPasswordKey = allForgottenPasswordTokens[0].token;
      const url = process.env.SERVER_URL || 'http://localhost:3000';

      const props = {
        forgotPasswordUrl: `${url}/change-password?key=${forgotPasswordKey}`,
        recipientEmail: User.email,
      };

      const options = {
        subject: 'Request for password reset',
        to: User.email,
        from: process.env.MAILGUN_FROM,
        domain: process.env.MAILGUN_DOMAIN,
        apiKey: process.env.MAILGUN_API_KEY,
      };

      await sendEmail('forgot-password.jsx', props, options);
    },
  },
};

exports.customSchema = {
  mutations: [
    {
      schema: 'startPasswordRecovery(email: String!): ForgottenPasswordToken',
      resolver: async (obj, { email }, context) => {
        const token = uuid();

        const tokenExpiration =
          parseInt(process.env.RESET_PASSWORD_TOKEN_EXPIRY) ||
          1000 * 60 * 60 * 24;

        const now = Date.now();
        const requestedAt = new Date(now).toISOString();
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
          console.error(
            userErrors,
            'Unable to find user when trying to create forgotten password token.'
          );
          return;
        }

        const userId = userData.allUsers[0].id;

        const result = {
          userId,
          token,
          requestedAt,
          expiresAt,
        };

        const { errors } = await context.executeGraphQL({
          context: context.createContext({ skipAccessControl: true }),
          query: `
            mutation createForgottenPasswordToken(
              $userId: ID!,
              $token: String,
              $requestedAt: DateTime,
              $expiresAt: DateTime,
            ) {
              createForgottenPasswordToken(data: {
                user: { connect: { id: $userId }},
                token: $token,
                requestedAt: $requestedAt,
                expiresAt: $expiresAt,
              }) {
                id
                token
                user {
                  id
                }
                requestedAt
                expiresAt
              }
            }
          `,
          variables: result,
        });

        if (errors) {
          console.error(errors, 'Unable to create forgotten password token.');
          return;
        }

        return true;
      },
    },
    {
      schema:
        'changePasswordWithToken(token: String!, password: String!): User',
      resolver: async (obj, { token, password }, context) => {
        const now = Date.now();

        const { errors, data } = await context.executeGraphQL({
          context: context.createContext({ skipAccessControl: true }),
          query: `
            query findUserFromToken($token: String!, $now: DateTime!) {
              passwordTokens: allForgottenPasswordTokens(where: { token: $token, expiresAt_gte: $now }) {
                id
                token
                user {
                  id
                }
              }
            }`,
          variables: { token, now },
        });

        if (errors || !data.passwordTokens || !data.passwordTokens.length) {
          console.error(errors, 'Unable to find token');
          throw errors.message;
        }

        const user = data.passwordTokens[0].user.id;
        const tokenId = data.passwordTokens[0].id;

        const { errors: passwordError } = await context.executeGraphQL({
          context: context.createContext({ skipAccessControl: true }),
          query: `mutation UpdateUserPassword($user: ID!, $password: String!) {
            updateUser(id: $user, data: { password: $password }) {
              id
            }
          }`,
          variables: { user, password },
        });

        if (passwordError) {
          console.error(passwordError, 'Unable to change password');
          throw passwordError.message;
        }

        await context.executeGraphQL({
          context: context.createContext({ skipAccessControl: true }),
          query: `mutation DeletePasswordToken($tokenId: ID!) {
            deleteForgottenPasswordToken(id: $tokenId) {
              id
            }
          }
        `,
          variables: { tokenId },
        });

        return true;
      },
    },
  ],
};
