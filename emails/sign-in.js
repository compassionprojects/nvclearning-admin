const React = require('react'); // eslint-disable-line
const host = process.env.SERVER_URL;
const { APP_NAME } = require('../constants');
// todo: use i18n

module.exports = {
  subject: {
    en: `Sign in to ${APP_NAME}`,
    fr: 'Connectez-vous à la CNV Virtual Plateforme',
  },

  // English template
  en: ({ name, magicLink }) => `
  <html>
    <body>
        <p>Dear ${name},</p>
        <div>
          <p>
            We are delighted to send you this <a href="${magicLink}&lang=en" target="_blank">magic link</a> so that you can sign in to the virtual exchange platform in preparation for the NVC course.
          </p>
          <p>
            If you have trouble using this link or if you’re dissatisfied with the platform, please do let us know by responding to this email and we will do our very best to support you.
          </p>
          Kind regards,<br>
          ${APP_NAME} Team<br>
          <a href="${host}/en/signin" target="_blank">${host}/en/signin</a>
        </div>
      </div>
    </body>
  </html>`,

  // French template
  fr: ({ name, magicLink }) => `
  <html>
    <body>
        <p>Dear ${name},</p>
        <div>
          <p>
            Nous sommes ravis de vous envoyer ce <a href="${magicLink}&lang=fr" target="_blank"> lien magique </a> afin que vous puissiez vous connecter à la plate-forme d'échange virtuel en préparation du cours NVC.
          </p>
          <p>
            Si vous rencontrez des difficultés pour utiliser ce lien ou si vous n'êtes pas satisfait de la plate-forme, veuillez nous le faire savoir en répondant à cet e-mail et nous ferons de notre mieux pour vous aider.
          </p>
          Cordialement, <br>
          ${APP_NAME} Team<br>
          <a href="${host}/en/signin" target="_blank">${host}/en/signin</a>
        </div>
      </div>
    </body>
  </html>`,
};
