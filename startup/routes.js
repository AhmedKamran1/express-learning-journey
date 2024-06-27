const express = require("express");
const logger = require("../middlewares/logger");
const errorMiddleware = require("../middlewares/error");
const movies = require("../routes/movies");
const actors = require("../routes/actors");
const users = require("../routes/users");
const auth = require("../routes/auth");
const home = require("../routes/home");
const returns = require("../routes/returns");

module.exports = function (app) {
  app.use(express.json());
  app.use(logger);
  app.use("/api/genres", movies);
  app.use("/api/actors", actors);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/returns", returns);
  app.use("/", home);
  app.use(errorMiddleware);
};
