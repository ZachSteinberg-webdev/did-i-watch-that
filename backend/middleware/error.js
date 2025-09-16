const ErrorResponse = require("../utilities/errorResponse.js");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = error.message;
  // Mongoose error - Bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = new ErrorResponse(message, 404);
  }
  if (err.code === 11000) {
    const message = "A user with this email address already exists.";
    error = new ErrorResponse(message, 404);
  }
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((value) => value.message);
    return res.status(400).json({
      success: false,
      error: message,
    });
  }
  res.status(error.statusCode || 500).json({
    success: false,
    error: [err.message] || ["Server Error"],
  });
};

module.exports = errorHandler;
