const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
  console.error("Error middleware: ", err);

  const customError = {
    msg: err.message || "Something went wrong try again later.",
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  if (err.name === "CastError") {
    customError.msg = `The id: ${err.value} provided is invalid`;
    customError.statusCode = 404;
  }

  res.status(customError.statusCode).json({
    success: false,
    msg: customError.msg,
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);

  res.status(404).json({ msg: `Route with ${req.url} not found.` });
};

module.exports.errorHandler = errorHandler;
module.exports.notFound = notFound;
