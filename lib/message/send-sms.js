const twilio = require("twilio");

async function sendSMS({ phone, message }) {
  const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

  return client.messages.create({
    body: message,
    from: "+17167454684",
    to: phone,
  });
}

module.exports = sendSMS;
