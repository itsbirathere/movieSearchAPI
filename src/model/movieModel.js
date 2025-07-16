import mongoose, { Schema } from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    year: {
      type: String,
    },
    genre: {
      type: [String],
    },
    director: {
      type: String,
    },
    imdbID: {
      type: String,
      required: true,
      unique: true,
    },
    poster: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;