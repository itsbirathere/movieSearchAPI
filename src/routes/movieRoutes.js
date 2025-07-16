import express from "express";
import { isLoggedIn } from "../middleware/auth.js";
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
router.post("/watchlist", isLoggedIn, addToWatchlist); // POST /api/movies/watchlist
router.get("/watchlist/:userId", isLoggedIn, getWatchlist); // GET /api/movies/watchlist/:userId

export default router;