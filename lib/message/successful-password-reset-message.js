const sendEmail = require("../helpers/sendEmail");

const clientURL = process.env.CLIENT_URL;

async function sendSuccessPasswordResetEmail({ email, firstName }) {
  const loginURL = `${clientURL}/login`;
  const message = `
  <div> 
    <p>Dear ${firstName},</p>
    <p>
      You have successfully reset your password 
      <a href="${loginURL}">Log in to your account.</a>
    </p>
    <br>
    <br>
    <p>YAWOO Team</p>
  </div>`;

  return sendEmail({
    to: email,
    subject: "Password reset successful",
    html: message,
  });
}

module.exports.sendSuccessPasswordResetEmail = sendSuccessPasswordResetEmail;
