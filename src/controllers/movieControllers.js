import axios from "axios";
import Movie from "../model/movieModel.js";
import User from "../model/userModel.js";

export const searchMovies = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }
    // Query OMDB API
    const response = await axios.get(
      `http://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${process.env.OMDB_API_KEY}`
    );
    const movies = response.data.Search || [];
    // Save movies to MongoDB (optional)
    if (movies.length > 0) {
      await Movie.insertMany(
        movies.map((movie) => ({
          title: movie.Title,
          year: movie.Year,
          imdbID: movie.imdbID,
          poster: movie.Poster,
        })),
        { ordered: false }
      );
    }
    res.json(movies);
  } catch (error) {
    console.error("Error searching movies:", error.message);
    res.status(500).json({ error: "Error searching movies" });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findOne({ imdbID: req.params.id });
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.json(movie);
  } catch (error) {
    console.error("Error fetching movie:", error.message);
    res.status(500).json({ error: "Error fetching movie" });
  }
};

export const addToWatchlist = async (req, res) => {
  try {
    const { userId, movieId } = req.body;
    if (!userId || !movieId) {
      return res.status(400).json({ error: "userId and movieId are required" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const movie = await Movie.findOne({ imdbID: movieId });
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    if (!user.watchlist.includes(movie._id)) {
      user.watchlist.push(movie._id);
      await user.save();
    }
    res.json({ message: "Movie added to watchlist" });
  } catch (error) {
    console.error("Error adding to watchlist:", error.message);
    res.status(500).json({ error: "Error adding to watchlist" });
  }
};

export const getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("watchlist");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user.watchlist);
  } catch (error) {
    console.error("Error fetching watchlist:", error.message);
    res.status(500).json({ error: "Error fetching watchlist" });
  }
};