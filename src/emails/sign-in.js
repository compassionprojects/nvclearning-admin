const React = require('react'); // eslint-disable-line

module.exports = ({ name, magicLink }) => `
  <html>
    <body>
        <p>Hi ${name}</p>
        <div>
          <p>
            Here's your <a href=${magicLink} target="_blank">magic sign in link</a> to the VIC platform.
          </p>
          <p>
            If you are having any trouble signing in or if you have any questions, you may respond to this email and we will help you out.
          </p>
          <p style="color: #aaa;">
            If you didn’t ask for your magic sign in link, please ignore this
            email.
          </p>
          Best,<br>
          Louise<br>
          <a href="http://peacefactory.fr" target="_blank">peacefactory.fr</a>
        </div>
      </div>
    </body>
  </html>`;
