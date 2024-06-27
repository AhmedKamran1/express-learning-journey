const express = require("express");
const Joi = require("joi");
const router = express.Router();
const Actor = require("../models/actor");

const actorSchema = Joi.object({
  name: Joi.string().required().min(3),
  age: Joi.number().required().min(3),
});

// get all actors
router.get("/", async (req, res) => {
  const actors = await Actor.find();
  res.send(actors);
});

// get specific actor
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const actor = await Actor.findById(id);
  if (!actor)
    return res.status(404).send("Actor not found with specified id!!");
  res.send(actor);
});

// update actor
router.patch("/:id", async (req, res) => {
  const { error } = actorSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const id = req.params.id;
  const actor = await Actor.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      age: req.body.age,
    },
    { new: true }
  );
  if (!actor)
    return res.status(404).send("Actor not found with specified id!!");
  res.send(actor);
});

// delete actor
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const actor = await Actor.findByIdAndDelete(id);
  if (!actor)
    return res.status(404).send("Actor not found with specified id!!");
  res.send(actor);
});

// post actor
router.post("/", async (req, res) => {
  const actor = req.body;
  const { error } = actorSchema.validate(actor);
  if (error) return res.status(400).send(error.details[0].message);
  // const newMovie = new Movie(movie);
  // await newMovie.save();
  const newActor = await Actor.create(actor);
  res.send(newActor);
});

module.exports = router;
