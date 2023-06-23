const Movie = require('../models/movie');
const ErrorCode = require('../error');
const BadRequest = require('../errors/BadRequestError');
const NotFound = require('../errors/NotFoundError');
const Forbidden = require('../errors/ForbiddenError');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(ErrorCode.STATUS_OK).send(movies))
    .catch(() => {
      next();
    });
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
  } = req.body;
  const owner = req.user._id;
  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
    owner,
  })
    .then((movie) => res.status(ErrorCode.CREATED).send(movie))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest(`Переданы некорректные данные фильма ${error}`));
        return;
      }
      next(error);
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findByIdAndRemove(movieId)
    .then((movie) => {
      if (movie === null) {
        next(new NotFound('Запрашиваемый фильм не найден'));
      } if (req.user._id !== movie.owner._id.toHexString()) {
        next(new Forbidden('Невозможно удалить фильм другого пользователя'));
      } else {
        res.status(ErrorCode.STATUS_OK).send({ message: 'Фильм удален' });
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
        return;
      }
      next(error);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
