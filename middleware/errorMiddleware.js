const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
  console.error("Error middleware: ", err);

  const customError = {
    msg: err.message || "Something went wrong try again later.",
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  if (err.name === "CastError") {
    customError.msg = `The id: ${err.value} provided is invalid`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }
  if (err.code && err.code === 11000) {
    console.log(err.keyValue);
    customError.msg = `The ${Object.keys(
      err.keyValue
    )} you entered already exist.`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
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
