const moviesRouters = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validateCreateMovie, validateDeleteMovie } = require('../middlewares/validation');

moviesRouters.get('/', getMovies);

moviesRouters.post('/', validateCreateMovie, createMovie);

moviesRouters.delete('/:movieId', validateDeleteMovie, deleteMovie);

module.exports = moviesRouters;
