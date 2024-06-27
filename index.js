require("express-async-errors");
const winston = require("winston");
const config = require("config");
const morgan = require("morgan");

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const logger = require("./middlewares/logger");
const authenticate = require("./middlewares/auth");
const app = express();
require("./startup/routes")(app);
require("./startup/prod")(app);
require("./startup/db")();
require("dotenv").config();

winston.add(new winston.transports.File({ filename: "logfile.log" }));

// app.use(authenticate);

app.set("view engine", "pug");
app.set("views", "./views");

// Configuration
// console.log(`Application name: ${config.get("name")}`);
// console.log(`Mail server: ${config.get("mail.host")}`);
// console.log(process.env.NODE_ENV);
// console.log(`Mail password: ${config.get("mail.password")}`);

// if (app.get("env") === "development") {
//   app.use(morgan("tiny"));
//   console.log("using morgan");
// }

const PORT = 8080;
const server = app.listen(PORT, () =>
  console.log(`listening on port ${PORT}....`)
);

module.exports = server;
