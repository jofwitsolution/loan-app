const sendEmail = require("../helpers/sendEmail");

const clientURL = process.env.CLIENT_URL;

async function sendPasswordResetEmail({ email, token }) {
  const resetURL = `${clientURL}/user/reset-password?token=${token}`;
  const message = `
  <div> 
    <h1>Hello!</h1>
    <p>
      Please reset password by clicking on the following link : 
      <a href="${resetURL}">Reset Password</a>
    </p>
    <br>
    <br>
    <p>YAWOO Team</p>
  </div>`;

  return sendEmail({
    to: email,
    subject: "Reset your password",
    html: message,
  });
}

module.exports.sendPasswordResetEmail = sendPasswordResetEmail;
