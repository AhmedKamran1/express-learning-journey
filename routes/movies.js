const express = require("express");
const authenticate = require("../middlewares/auth");
const authorize = require("../middlewares/admin");
const Joi = require("joi");
const router = express.Router();
const Movie = require("../models/movie");
const { NotFoundError } = require("../utils/errors");
const validateObjectId = require("../middlewares/validateObjectId");

const movieSchema = Joi.object({
  name: Joi.string().required().min(3),
  genre: Joi.string().required().min(3),
  actors: Joi.array().required(),
});

// get all movies
router.get("/", async (req, res) => {
  const movies = await Movie.find().populate("actors");
  res.send(movies);
});

// get specific movie
router.get("/:id", validateObjectId, async (req, res) => {
  const id = req.params.id;
  const movie = await Movie.findById(id);
  if (!movie) throw NotFoundError("Movie not found");
  res.send(movie);
});

// update genre
router.patch("/:id", async (req, res) => {
  const { error } = movieSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const id = req.params.id;
  const movie = await Movie.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      genre: req.body.genre,
    },
    { new: true }
  );
  if (!movie)
    return res.status(404).send("Movie not found with specified id!!");
  res.send(movie);
});

// delete movie
router.delete("/:id", [authenticate, authorize], async (req, res) => {
  const id = req.params.id;
  const movie = await Movie.findByIdAndDelete(id);
  if (!movie)
    return res.status(404).send("Movie not found with specified id!!");
  res.send(movie);
});

// post movie
router.post("/", authenticate, async (req, res) => {
  const movie = req.body;
  const { error } = movieSchema.validate(movie);
  if (error) return res.status(400).send(error.details[0].message);
  // const newMovie = new Movie(movie);
  // await newMovie.save();
  const newMovie = await Movie.create(movie);
  res.send(newMovie);
});

module.exports = router;
