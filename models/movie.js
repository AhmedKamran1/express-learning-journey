const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
    enum: ["horror", "comedy", "action"],
  },
  actors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Actor",
      required: true,
    },
  ],
});

module.exports = mongoose.model("Movie", movieSchema);
