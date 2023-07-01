const router = require('express').Router();
const usersRouters = require('./users');
const moviesRouters = require('./movies');
const { createUser, login } = require('../controllers/users');
const { validateSignup, validateSignin } = require('../middlewares/validation');
const auth = require('../middlewares/auth');
const NotFound = require('../errors/NotFoundError');

router.post('/signup', validateSignup, createUser);
router.post('/signin', validateSignin, login);
router.use('/users', auth, usersRouters);
router.use('/movies', auth, moviesRouters);
router.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

module.exports = router;
