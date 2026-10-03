const { validationResult } = require("express-validator");
const ApiError = require("../utils/api-error");

const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new ApiError(errors.array().at(0).msg, 400));
  }
  return next();
};

module.exports = validationMiddleware;
