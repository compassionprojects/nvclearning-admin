const {
  Select,
  Integer,
  Url,
  Text,
  Relationship,
  Checkbox,
  Password,
  DateTime,
} = require('@keystonejs/fields');
const {
  atTracking,
  byTracking,
  singleton,
} = require('@keystonejs/list-plugins');
const { gql } = require('apollo-server-express');
const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');
// const { graphql } = require('graphql');

/**
 * Access control
 */

const userIsAdmin = ({ authentication: { item: user } }) =>
  Boolean(user && user.isAdmin);
const userIsAuthenticated = ({ authentication: { item } }) => Boolean(item);

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
    courses: { type: Relationship, ref: 'Course', many: true },
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
    read: true,
    create: userIsAdmin,
    update: userIsAdmin,
    delete: userIsAdmin,
  },
  fields: {
    title: { type: Text, isRequired: true },
    description: {
      type: Wysiwyg,
      isRequired: true,
      editorConfig: {
        block_formats: 'Paragraph=p;',
      },
    },
    url: { type: Url },
    contentType: { type: Select, options: 'image, video, document' },
    course: { type: Relationship, ref: 'Course' },
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
    description: {
      type: Wysiwyg,
      isRequired: true,
      editorConfig: {
        block_formats: 'Paragraph=p;',
      },
    },
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
    parent: { type: Relationship, ref: 'Message' },
    orphaned: { type: Boolean },
    course: { type: Relationship, ref: 'Course', isRequired: true },
  },
  labelResolver: (item) => `Message ${item.id}`,
  plugins: plugins.concat(byTracking()),
  hooks: {
    // Update replies and set them to orphaned
    // Otherwise replies will show up on in the feed
    async beforeDelete({ existingItem, context }) {
      // Get all replies of the message that is going to be deleted
      const { data, errors } = await context.executeGraphQL({
        context: context.createContext({ skipAccessControl: true }),
        query: gql`
          query allReplies($id: ID!) {
            allMessages(where: { parent: { id: $id } }) {
              id
            }
          }
        `,
        variables: { id: existingItem.id },
      });
      if (errors) throw errors.message;
      if (!data.allMessages.length) return;

      // Set all the replies to orphaned so that it's not rendered
      // in the client
      const { errors: err } = await context.executeGraphQL({
        context: context.createContext({ skipAccessControl: true }),
        query: gql`
          mutation setOrphaned($messages: [MessagesUpdateInput]) {
            updateMessages(data: $messages) {
              id
            }
          }
        `,
        variables: {
          messages: data.allMessages.map((m) => ({
            id: m.id,
            data: { orphaned: true },
          })),
        },
      });

      if (err) throw errors.message;
    },
  },
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

exports.Trainer = {
  access: {
    read: true,
    create: userIsAdmin,
    update: userIsAdmin,
    delete: userIsAdmin,
  },
  fields: {
    name: { type: Text, isRequired: true },
    bio: { type: Wysiwyg, isRequired: true },
    avatar_url: { type: Url },
  },
  labelResolver: (item) => item.name,
  plugins: plugins.concat(byTracking()),
};

exports.Course = {
  access: {
    read: true,
    create: userIsAdmin,
    update: userIsAdmin,
    delete: userIsAdmin,
  },
  fields: {
    title: { type: Text, isRequired: true },
    description: { type: Wysiwyg, isRequired: true },
    about: { type: Wysiwyg, isRequired: true },
    details: { type: Wysiwyg, isRequired: true },
    facebookLink: { type: Url },
    dateStart: { type: DateTime, isRequired: true },
    dateEnd: { type: DateTime, isRequired: true },
    trainers: {
      type: Relationship,
      ref: 'Trainer',
      many: true,
      isRequired: true,
    },
  },
  labelResolver: (item) => item.title,
  plugins: plugins.concat(byTracking()),
};

exports.Pricing = {
  access: {
    read: true,
    create: userIsAdmin,
    update: userIsAdmin,
    delete: userIsAdmin,
  },
  fields: {
    title: { type: Text, isRequired: true },
    price: { type: Integer, isRequired: true },
    course: { type: Relationship, ref: 'Course', isRequired: true },
    currency: { type: Select, options: 'EUR', isRequired: true },
    stripePriceId: { type: Text, isRequired: true },
    peopleEquivalent: { type: Integer },
  },
  labelResolver: (item) => item.title,
  plugins: plugins.concat(byTracking()),
};

exports.Order = {
  access: {
    read: true,
    create: true,
    update: userIsAdmin,
    delete: userIsAdmin,
  },
  fields: {
    stripeSessionId: { type: Text, isRequired: true },
    stripeCustomerEmail: { type: Text, isRequired: true },
    stripeCustomerId: { type: Text, isRequired: true },
    course: { type: Relationship, ref: 'Course', isRequired: true },
  },
  plugins: plugins.concat(byTracking()),
};

exports.FAQ = {
  access: {
    read: true,
    create: userIsAdmin,
    update: userIsAdmin,
    delete: userIsAdmin,
  },
  fields: {
    question: { type: Text, isRequired: true },
    answer: { type: Wysiwyg, isRequired: true },
    courses: {
      type: Relationship,
      ref: 'Course',
      many: true,
      isRequired: true,
    },
    weight: { type: Integer },
  },
  plugins: plugins.concat(byTracking()),
};
