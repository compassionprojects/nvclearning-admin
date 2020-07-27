const {
  Select,
  Integer,
  Url,
  Text,
  Relationship,
  Checkbox,
  Password,
} = require('@keystonejs/fields');
const {
  atTracking,
  byTracking,
  singleton,
} = require('@keystonejs/list-plugins');

const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');
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
    read: userIsAuthenticated,
    create: userIsAdmin,
    update: userIsAdmin,
    delete: userIsAdmin,
    auth: true,
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

exports.Space = {
  access: {
    read: userIsAuthenticated,
    create: userIsAdmin,
    update: userIsAdmin,
    delete: userIsAdmin,
  },
  fields: {
    title: { type: Text, isRequired: true },
    position: { type: Integer },
  },
  labelResolver: (item) => item.title,
  plugins: plugins.concat(byTracking()),
};

exports.LibrarySection = {
  access: {
    read: userIsAuthenticated,
    create: userIsAdmin,
    update: userIsAdmin,
    delete: userIsAdmin,
  },
  fields: {
    title: { type: Text, isRequired: true },
  },
  labelResolver: (item) => item.title,
  plugins: plugins.concat(byTracking()),
};

exports.Content = {
  access: {
    read: userIsAuthenticated,
    create: userIsAdmin,
    update: userIsAdmin,
    delete: userIsAdmin,
  },
  fields: {
    title: { type: Text, isRequired: true },
    description: { type: Wysiwyg, isRequired: true },
    url: { type: Url },
    contentType: { type: Select, options: 'image, video, document' },
    librarySection: { type: Relationship, ref: 'LibrarySection' },
    space: { type: Relationship, ref: 'Space' },
    callToActionTitle: { type: Text },
    callToActionUrl: { type: Url },
  },
  plugins: plugins.concat(byTracking()),
  adminConfig: {
    defaultColumns: 'title, contentType, librarySection, space, updatedAt',
    defaultSort: 'createdAt',
  },
};

exports.Schedule = {
  access: {
    read: userIsAuthenticated,
    create: userIsAdmin,
    update: userIsAdmin,
    delete: userIsAdmin,
  },
  fields: {
    description: { type: Wysiwyg, isRequired: true },
  },
  plugins: plugins.concat([byTracking(), singleton()]),
};

exports.Card = {
  access: {
    read: userIsAuthenticated,
    create: userIsAdmin,
    update: userIsAdmin,
    delete: userIsAdmin,
  },
  fields: {
    text: { type: Text, isRequired: true, isMultiline: true },
    type: {
      type: Select,
      options: 'feelings, needs, challenge',
      isRequired: true,
    },
  },
  plugins: plugins.concat(byTracking()),
};

exports.Message = {
  // @todo make sure the user is self
  access: {
    read: userIsAuthenticated,
    create: userIsAuthenticated,
    update: userIsAuthenticated,
    delete: userIsAuthenticated,
  },
  fields: {
    body: { type: Text, isRequired: true, isMultiline: true },
    type: {
      type: Relationship,
      ref: 'MessageType',
      isRequired: true,
    },
    replies: { type: Relationship, ref: 'Message', many: true },
  },
  labelResolver: (item) => `Message ${item.id}`,
  plugins: plugins.concat(byTracking()),
};

exports.MessageType = {
  access: {
    read: userIsAuthenticated,
    create: userIsAdmin,
    update: userIsAdmin,
    delete: userIsAdmin,
  },
  fields: {
    title: { type: Text, isRequired: true },
  },
  labelResolver: (item) => item.title,
  plugins: plugins.concat(byTracking()),
};
