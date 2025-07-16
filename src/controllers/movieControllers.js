import axios from "axios";
import Movie from "../model/movieModel.js";
import User from "../model/userModel.js";

export const searchMovies = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    res.status(400).json({
      message: "query parameter is required",
    });
    return;
  }

  try {
    const response = await axios.get(
      `http://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${process.env.OMDB_API_KEY}`
    );
    const movies = response.data.Search || [];

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

    res.status(200).json({
      message: "movies fetched successfully",
      data: movies,
    });
  } catch (error) {
    console.error("Error searching movies:", error.message);
    res.status(500).json({
      message: "something went wrong during movie search",
    });
  }
};

export const getMovieById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({
      message: "movie id is required",
    });
    return;
  }

  try {
    const movie = await Movie.findOne({ imdbID: id });
    if (!movie) {
      res.status(404).json({
        message: "movie with this id is not found",
      });
      return;
    }

    res.status(200).json({
      message: "movie fetched successfully",
      data: movie,
    });
  } catch (error) {
    console.error("Error fetching movie:", error.message);
    res.status(500).json({
      message: "something went wrong while fetching movie",
    });
  }
};

export const addToWatchlist = async (req, res) => {
  const { movieId } = req.body;
  const userId = req.user.id;
  if (!movieId || !userId) {
    res.status(400).json({
      message: "movieId and userId are required",
    });
    return;
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        message: "user not found",
      });
      return;
    }

    const movie = await Movie.findOne({ imdbID: movieId });
    if (!movie) {
      res.status(404).json({
        message: "movie not found",
      });
      return;
    }

    if (!user.watchlist.includes(movie._id)) {
      user.watchlist.push(movie._id);
      await user.save();
    }

    res.status(200).json({
      message: "movie added to watchlist successfully",
    });
  } catch (error) {
    console.error("Error adding to watchlist:", error.message);
    res.status(500).json({
      message: "something went wrong while adding to watchlist",
    });
  }
};

export const getWatchlist = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    res.status(400).json({
      message: "userId is required",
    });
    return;
  }

  try {
    const user = await User.findById(userId).populate("watchlist");
    if (!user) {
      res.status(404).json({
        message: "user not found",
      });
      return;
    }

    res.status(200).json({
      message: "watchlist fetched successfully",
      data: user.watchlist,
    });
  } catch (error) {
    console.error("Error fetching watchlist:", error.message);
    res.status(500).json({
      message: "something went wrong while fetching watchlist",
    });
  }
};