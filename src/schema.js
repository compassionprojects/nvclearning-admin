const { Text, Checkbox, Password } = require('@keystonejs/fields');
const { atTracking /* byTracking */ } = require('@keystonejs/list-plugins');
// const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');
// const { graphql } = require('graphql');

/**
 * Access control
 */
/*
const userIsAdmin = ({ authentication: { item: user } }) =>
  Boolean(user && user.isAdmin);
const userOwnsItem = ({ authentication: { item: user } }) =>
  user && { id: user.id };
const userIsAuthenticated = ({ authentication: { item } }) => !!item;
const userIsAdminOrAuthenticated = (auth) => {
  const isAdmin = userIsAdmin(auth);
  const isAuthenticated = userIsAuthenticated(auth);
  return isAdmin ? isAdmin : isAuthenticated;
};
const access = {
  userIsAdmin,
  userOwnsItem,
  userIsAdminOrAuthenticated,
  userIsAuthenticated,
};
*/

const dateFormat = { format: 'DD/MM/YYYY h:mm A' };
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
    authToken: {
      type: Text,
      access: {
        create: false,
        read: true,
        update: false,
        delete: false,
      },
    },
  },
  plugins,
};
