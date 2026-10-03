const jwt = require("jsonwebtoken");

const UserTokenModel = require("../models/refresh-token-model");

const generateAccessToken = (userId) =>
  jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  });

const generateRefreshToken = (userId) =>
  jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
