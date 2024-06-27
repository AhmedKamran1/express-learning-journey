const express = require("express");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/user");

const userSchema = Joi.object({
  name: Joi.string().min(5).max(50).required(),
  email: Joi.string().min(5).max(255).required().email(),
  password: Joi.string().min(5).max(1024).required(),
});

// get all users
router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

// get loggedin user
router.get("/details", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("name email");
  res.send(user);
});

// register user
router.post("/", async (req, res) => {
  const user = req.body;
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let userExists = await User.findOne({ email: req.body.email });
  if (userExists) return res.status(400).send("User already registered.");
  user.password = await bcrypt.hash(user.password, 10);
  const newUser = await User.create(user);
  const token = newUser.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send({ name: newUser.name, email: newUser.email });
});

module.exports = router;
