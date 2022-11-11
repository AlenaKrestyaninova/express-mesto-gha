const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { JWT_SECRET } = require('../utils/key');
const User = require('../models/user');
const { signToken } = require('../utils/jwt');
const ValidationError = require('../utils/errors/ValidationError'); // 400
const UnauthorizedError = require('../utils/errors/UnauthorizedError'); // 401

//  Проверка логина  //
const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new ValidationError('password or email empty'));
    return;
  }
  User.findOne({ email }).select('+password')
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) { return next(new UnauthorizedError('Wrong email or password')); }
          const result = signToken(user._id);
          if (!result) {
            return next(new UnauthorizedError('Wrong email or password'));
          }
          return res
            .status(200)
            .cookie('authorization', result, {
              maxAge: 60 * 60 * 24 * 7,
              httpOnly: true,
              sameSite: true,
            })
            .send({ result, message: 'Athorization successful' });
        });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { login };
