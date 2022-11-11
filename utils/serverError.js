const serverError = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({ message: statusCode === 500 ? 'Ошибка работы сервера' : message });
  next();
};

module.exports = serverError;
