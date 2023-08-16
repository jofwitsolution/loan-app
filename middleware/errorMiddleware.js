const errorHandler = (err, req, res, next) => {
  console.error("Error middleware: ", err);

  res.status(500).json({
    success: false,
    msg: err.message,
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);

  res.status(404).json({ msg: `Route with ${req.url} not found.` });
};

module.exports.errorHandler = errorHandler;
module.exports.notFound = notFound;
