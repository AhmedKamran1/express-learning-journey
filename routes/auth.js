const express = require("express");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/user");

const authSchema = Joi.object({
  email: Joi.string().min(5).max(255).required().email(),
  password: Joi.string().min(5).max(1024).required(),
});

// login user
router.post("/", async (req, res) => {
  const credentials = req.body;
  const { error } = authSchema.validate(credentials);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("User not registered.");
  const validPassword = await bcrypt.compare(
    credentials.password,
    user.password
  );
  if (!validPassword) return res.status(400).send("Invalid credentials.");
  const token = user.generateAuthToken();
  res.send(token);
});

module.exports = router;
