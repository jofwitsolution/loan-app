function response({ res, statusCode, data, msg }) {
  res.status(statusCode).json({ success: true, data, msg });
}

module.exports = response;
