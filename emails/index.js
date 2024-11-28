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
  signin: function ({ user, ...props }) {
    const to = user.email;
    const lang = user.language || 'en';
    const subject = signinTemplate.subject[lang];
    const signin = signinTemplate[lang]; // default english
    const body = signin({
      name: user.name,
      lang,
      ...props,
    });
    send({
      to,
      subject,
      body,
    });
  },
};
