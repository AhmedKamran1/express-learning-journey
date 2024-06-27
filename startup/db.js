const mongoose = require("mongoose");
const winston = require("winston");

const connectionURL = "mongodb://127.0.0.1:27017/playground";

module.exports = function () {
  mongoose
    .connect(connectionURL)
    .then(() => winston.info("connected to db"))
    .catch((err) => winston.error("could not connect to db", err));
};
