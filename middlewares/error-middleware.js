const jwt = require("jsonwebtoken");
const multer = require("multer");

const ApiError = require("../utils/api-error");

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (
    err instanceof jwt.TokenExpiredError ||
    err instanceof jwt.JsonWebTokenError ||
    err instanceof jwt.NotBeforeError
  ) {
    err = new ApiError("Not authorized", 401);
  } else if (err instanceof multer.MulterError) {
    err = new ApiError(err.message, 400);
  } else if (err.name === "CastError") {
    err = new ApiError(`Invalid ${err.path}: ${err.value}.`, 400);
  } else if (err.code === 11000) {
    err = duplicateErrorHandler(err);
  }

  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else {
    sendErrorForProd(err, res);
  }
};

const sendErrorForDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorForProd = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const duplicateErrorHandler = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];

  return new ApiError(
    `${field}: '${value}' aleady exist. please use another`,
    409,
  );
};

module.exports = globalError;
