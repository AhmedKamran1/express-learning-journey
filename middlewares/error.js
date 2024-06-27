const winston = require("winston");
const ERROR_CODES = require("../utils/constants/error-codes");

const errorMiddleware = (err, req, res, next) => {
  const errStatus = err.status || ERROR_CODES.INTERNAL_SERVER_ERROR;
  const errMessage = err.message || "Server Error, Something went wrong";
  winston.error(err);
  return res.status(errStatus).send({ message: errMessage });
};

module.exports = errorMiddleware;
