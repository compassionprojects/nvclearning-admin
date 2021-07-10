const {
  Select,
  Integer,
  Url,
  File,
  Text,
  Relationship,
  Checkbox,
  Password,
  DateTime,
} = require('@keystonejs/fields');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
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

const { S3Adapter } = require('@keystonejs/file-adapters');

const endpoint = process.env.DO_ENDPOINT;
const S3_PATH = 'staging';

const fileAdapter = new S3Adapter({
  bucket: process.env.DO_BUCKET,
  folder: S3_PATH,
  publicUrl: (file) => {
    const { _meta } = file;
    return _meta && _meta.Location;
  },
  s3Options: {
    // Optional paramaters to be supplied directly to AWS.S3 constructor
    // apiVersion: '2006-03-01',
    accessKeyId: process.env.DO_KEY,
    secretAccessKey: process.env.DO_SECRET,
    endpoint,
  },
  uploadParams: ({ id }) => ({
    ACL: 'public-read',
    Metadata: {
      keystone_id: `${id}`,
    },
  }),
});

/**
 * Schemas
 */

// user schema
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
    language: {
      type: Select,
      options: [
        { value: 'en', label: 'English' },
        { value: 'fr', label: 'Français' },
      ],
    },
    disabled: { type: Checkbox },
    isAdmin: { type: Checkbox },
    password: {
      type: Password,
    },
    lastLogin: { type: DateTime },
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
    courses: {
      type: Relationship,
      ref: 'Course',
      many: true,
      isRequired: true,
    },
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
    courses: {
      type: Relationship,
      ref: 'Course',
      many: true,
      isRequired: true,
    },
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
    courses: { type: Relationship, ref: 'Course', many: true },
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

exports.Attachment = {
  fields: {
    file: { type: File, adapter: fileAdapter },
  },
  labelResolver: (item) => `Attachment ${item.id}`,
  access: {
    read: true,
    update: userIsAdmin,
    create: userIsAuthenticated,
    delete: userIsAdmin,
  },
  plugins: plugins.concat(byTracking()),
  adminConfig: {
    defaultColumns: 'url, createdBy, createdAt',
    defaultSort: 'createdAt',
  },
};

exports.Room = {
  fields: {
    title: { type: Text, isRequired: true },
    link: { type: Url, isRequired: true },
  },
  labelResolver: (item) => item.title,
  access: {
    read: true,
    update: userIsAdmin,
    create: userIsAuthenticated,
    delete: userIsAdmin,
  },
  plugins: plugins.concat(byTracking()),
  adminConfig: {
    defaultColumns: 'title, link, createdBy',
    defaultSort: 'createdAt',
  },
};

exports.Session = {
  access: {
    read: true,
    create: userIsAdmin,
    update: userIsAdmin,
    delete: userIsAdmin,
  },
  labelResolver: (item) => item.title,
  fields: {
    title: { type: Text, isRequired: true },
    course: { type: Relationship, ref: 'Course', isRequired: true },
    description: {
      type: Wysiwyg,
      editorConfig: {
        block_formats: 'Paragraph=p;',
      },
    },
    attachments: { type: Relationship, ref: 'Attachment', many: true },
    trainers: { type: Relationship, ref: 'Trainer', many: true },
    date: {
      type: DateTime,
      isRequired: true,
      format: 'dd/MM/yyyy HH:mm O',
      yearRangeFrom: new Date().getFullYear(),
      yearRangeTo: new Date().getFullYear() + 1,
      yearPickerType: 'auto',
    },
    room: { type: Relationship, ref: 'Room', isRequired: true },
    videoRecordingUrl: { type: Url },
  },
  plugins: plugins.concat(byTracking()),
  adminConfig: {
    defaultColumns: 'date, trainers, course',
    defaultSort: 'date',
  },
};

exports.Schedule = {
  access: {
    read: true,
    create: userIsAdmin,
    update: userIsAdmin,
    delete: userIsAdmin,
  },
  fields: {
    course: { type: Relationship, ref: 'Course', isRequired: true },
    description: {
      type: Wysiwyg,
      editorConfig: {
        block_formats: 'Paragraph=p;',
      },
    },
  },
  plugins: plugins.concat(byTracking()),
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
    orphaned: { type: Checkbox },
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
    courses: {
      type: Relationship,
      ref: 'Course',
      many: true,
      isRequired: true,
    },
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
    avatar_url: { type: Url },
    bio: { type: Wysiwyg, isRequired: true },
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
    description: {
      type: Wysiwyg,
      isRequired: true,
      editorConfig: {
        valid_elements: 'span,p,strong,b',
        toolbar: 'undo redo code',
      },
    },
    dateStart: { type: DateTime, isRequired: true },
    dateEnd: { type: DateTime, isRequired: true },
    trainers: {
      type: Relationship,
      ref: 'Trainer',
      many: true,
      isRequired: true,
    },
    facebookLink: { type: Url },
    ticketUrl: { type: Url },
    videoUrl: { type: Url },
    about: { type: Wysiwyg, isRequired: true },
    details: { type: Wysiwyg, isRequired: true },
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
  labelResolver: (item) => `Order ${item.id}`,
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
    courses: {
      type: Relationship,
      ref: 'Course',
      many: true,
      isRequired: true,
    },
    weight: { type: Integer },
    answer: {
      type: Wysiwyg,
      isRequired: true,
      editorConfig: {
        valid_elements: 'span,p,strong,b,a[href|target=_blank],ul,li,ol,em,i',
        toolbar:
          'undo redo bold italic link | bullist numlist outdent indent | code',
      },
    },
  },
  labelResolver: (item) => `Question ${item.id}`,
  plugins: plugins.concat(byTracking()),
};
