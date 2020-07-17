const postmark = require('postmark');
const signin = require('./sign-in');
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
  signin: function ({ to, subject, ...props }) {
    const body = signin({ to, ...props });
    send({
      to,
      subject,
      body,
    });
  },
};
