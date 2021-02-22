const postmark = require('postmark');
const signinTemplate = require('./sign-in');
const isProduction = process.env.NODE_ENV === 'production';

const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

function send({ to, subject, body }) {
  if (!isProduction) {
    console.log({ to, subject, body });
    return;
  }
  client.sendEmail({
    From: process.env.POSTMARK_FROM,
    To: to,
    Subject: subject,
    HtmlBody: body,
  });
}

module.exports = {
  signin: function ({ user, subject, ...props }) {
    const to = user.email;
    const signin = signinTemplate[user.language || 'en']; // default english
    const body = signin({
      to,
      name: user.name,
      ...props,
    });
    send({
      to,
      subject,
      body,
    });
  },
};
