const React = require('react'); // eslint-disable-line

module.exports = ({ recipientEmail, signInUrl }) => (
  <html>
    <body>
      <div>
        <p>Hi {recipientEmail}</p>
        <div>
          <p>
            We have received your request to send you the magic sign-in link.
          </p>
          <ul>
            <li>
              <a href={signInUrl} target="_blank">
                Sign in
              </a>
            </li>
          </ul>
          <p>
            If you didn’t ask for your magic sign-in link, please ignore this
            email.
          </p>
        </div>
      </div>
    </body>
  </html>
);
