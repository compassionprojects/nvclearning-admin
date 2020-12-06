const React = require('react'); // eslint-disable-line

module.exports = ({ name, magicLink }) => `
  <html>
    <body>
        <p>Dear ${name},</p>
        <div>
          <p>
            We are delighted to send you this <a href="${magicLink}" target="_blank">magic link</a> so that you can sign in to Peace Factory’s virtual exchange platform in preparation for the NVC course.
          </p>
          <p>
            If you have trouble using this link or if you’re dissatisfied with our answers to the frequently asked questions which you’ll see on the platform, please do let us know by responding to this email and we will do our very best to support you.
          </p>
          Kind regards,<br>
          Natalia<br>
          <a href="https://vic.peacefactory.fr" target="_blank">vic.peacefactory.fr</a>
        </div>
      </div>
    </body>
  </html>`;
