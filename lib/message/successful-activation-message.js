const sendEmail = require("../helpers/sendEmail");

const clientURL = process.env.CLIENT_URL;

async function sendSuccessActivationEmail({ email, firstName }) {
  const loginURL = `${clientURL}/login`;
  const message = `
  <div> 
    <h1>Welcome to YAWOO</h1>
    <p>Dear ${firstName},</p>
    <p>
      You have successfully activated your account.
      <a href="${loginURL}">Log in to your account.</a>
    </p>
    <br>
    <br>
    <p>YAWOO Team</p>
  </div>`;

  return sendEmail({
    to: email,
    subject: "Welcome to Yawoo",
    html: message,
  });
}

module.exports.sendSuccessActivationEmail = sendSuccessActivationEmail;
