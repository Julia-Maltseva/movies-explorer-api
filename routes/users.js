const usersRouters = require('express').Router();
const { getUser, updateUser } = require('../controllers/users');
const { validateUpdateUser } = require('../middlewares/validation');

usersRouters.get('/me', getUser);

usersRouters.patch('/me', validateUpdateUser, updateUser);

module.exports = usersRouters;
