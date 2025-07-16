import express from "express";
import {
  searchMovies,
  getMovieById,
  addToWatchlist,
  getWatchlist,
} from "../controllers/movieController.js";

const router = express.Router();

// Movie routes
router.get("/search", searchMovies); // GET /api/movies/search?query=Inception
router.get("/:id", getMovieById); // GET /api/movies/:id
router.post("/watchlist", addToWatchlist); // POST /api/movies/watchlist
router.get("/watchlist/:userId", getWatchlist); // GET /api/movies/watchlist/:userId

export default router;