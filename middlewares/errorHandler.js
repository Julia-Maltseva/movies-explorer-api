const ErrorCode = require('../error');

const errorHandler = (err, req, res, next) => {
  const { statusCode = ErrorCode.SERVER_ERROR, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === ErrorCode.SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};

module.exports = errorHandler;
