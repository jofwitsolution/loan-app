const sendEmail = require("../helpers/sendEmail");

const clientURL = process.env.CLIENT_URL;

async function sendActivationEmail({ email, firstName, token }) {
  const resetURL = `${clientURL}/user/activation?token=${token}`;
  const message = `
  <div>
  <p>Dear ${firstName},</p>
    <p>
      Please click on the link : 
      <a href="${resetURL}">Activate</a>
       to activate your account.
    </p>
    <p>If you didn't sign up on our website, please ignore this message.</p>
    <br>
    <br>
    <p>Thank you</p>
    <p>YAWOO Team</p>
  </div>`;

  return sendEmail({
    to: email,
    subject: "Activate your account",
    html: message,
  });
}

module.exports.sendActivationEmail = sendActivationEmail;
