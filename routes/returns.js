const express = require("express");
const authenticate = require("../middlewares/auth");
const authorize = require("../middlewares/admin");
const Joi = require("joi");
const router = express.Router();
const Rental = require("../models/rental");
const { NotFoundError } = require("../utils/errors");
const validateObjectId = require("../middlewares/validateObjectId");
const moment = require("moment");

router.post("/", authenticate, async (req, res) => {
  if (!req.body.customerId)
    return res.status(400).send("customerid not provided!");
  if (!req.body.movieId) return res.status(400).send("movieid not provided!");

  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId,
  });

  if (!rental) return res.status(404).send("Rental not found");

  if (rental.dateReturned)
    return res.status(400).send("return already processed");

  rental.return();

  await rental.save();
  return res.send();
});

module.exports = router;
