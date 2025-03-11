const express = require('express');
const Movie = require('../models/Movie');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get all movies with filters
router.get('/', async (req, res) => {
  const { genre, minRating } = req.query;
  const filter = {};

  if (genre) filter.genre = genre;

  let movies = await Movie.find(filter);
  if (minRating) movies = movies.filter(movie => movie.averageRating >= parseFloat(minRating));

  res.json(movies.map(movie => ({
    title: movie.title,
    id: movie.id,
    genre: movie.genre,
    averageRating: movie.averageRating,
  })));
});

// Add a new movie (Authenticated)
router.post('/', authMiddleware, async (req, res) => {
  const { title, genre } = req.body;
  if (!title || !genre) return res.status(400).json({ message: 'Title and genre are required' });

  const movie = new Movie({ title, genre, ratings: [] });
  await movie.save();

  res.json({ message: 'Movie added successfully' });
});

// Rate a movie (Authenticated)
router.post('/:id/rate', authMiddleware, async (req, res) => {
  const { rating } = req.body;
  if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Invalid rating (1-5)' });

  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).json({ message: 'Movie not found' });

  movie.ratings.push({ userId: req.user._id, rating });
  await movie.save();

  res.json({ message: 'Rating submitted' });
});

// Delete a movie (Authenticated)
router.delete('/:id', authMiddleware, async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(404).json({ message: 'Movie not found' });

  res.json({ message: 'Movie deleted successfully' });
});

module.exports = router;
