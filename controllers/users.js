const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ErrorCode = require('../error');
const Conflict = require('../errors/ConflictError');
const BadRequest = require('../errors/BadRequestError');
const NotFound = require('../errors/NotFoundError');
const Unauthorized = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = async (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  const hash = await bcrypt.hash(password, 10);
  return User.create({
    name,
    email,
    password: hash,
  })
    .then((user) => res.status(ErrorCode.CREATED).send({
      data: {
        name: user.name,
        email: user.email,
      },
    }))
    .catch((error) => {
      if (error.code === 11000) {
        next(new Conflict('Пользователь с такими данными уже существует'));
        return;
      }
      if (error.name === 'ValidationError') {
        next(new BadRequest(`Переданы некорректные данные пользователя ${error}`));
        return;
      }
      next(error);
    });
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.status(ErrorCode.STATUS_OK).send(user);
      } else {
        next(new NotFound('Запрашиваемый пользователь не найден'));
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User
    .findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new Unauthorized('Неправильный email или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new Unauthorized('Неправильный email или пароль'));
          }
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
          return res.send({ token });
        });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest(`Переданы некорректные данные пользователя ${error}`));
        return;
      }
      next(error);
    });
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.status(ErrorCode.STATUS_OK).send(user);
      } else {
        next(new NotFound('Запрашиваемый пользователь не найден'));
      }
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest(`Переданы некорректные данные пользователя ${error}`));
        return;
      }
      next(error);
    });
};

module.exports = {
  createUser,
  updateUser,
  login,
  getUser,
};
