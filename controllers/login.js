const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { JWT_SECRET } = require('../utils/key');
const User = require('../models/user');
const { signToken } = require('../utils/jwt');
const {
  WRONG_DATA_CODE, // 400
  UNAUTHORIZED, // 401
  ERROR_SERVER_CODE, // 500
} = require('../utils/constants');

//  Проверка логина  //
const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(WRONG_DATA_CODE).send({ message: 'password or email empty' });
  }
  User.findOne({ email })
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) { res.status(UNAUTHORIZED).send({ message: 'Wrong password or email' }); }
          const result = signToken(user._id);
          if (!result) {
            return res.status(ERROR_SERVER_CODE).send({ message: 'token creation error' });
          }
          return res.status(200).send({ data: result });
        });
    })

    .catch((err) => {
      console.log(err);
      return res.status(ERROR_SERVER_CODE).send({ message: err.message });
    });
};

module.exports = { login };

// User.findUserByCredentials(email, password)
// .then((user) => {
//   const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
//   res.cookie('authorization', token, {
//     httpOnly: true,
//     maxAge: 60 * 60 * 24 * 7,
//     sameSite: true,
//   }).status(200).send(user);
// })
// .catch((err) => {
//   if (err.code === 11000) {
//     return res.send({ message: 'Пользователь с такими данными существует' });
//   }
//   return res.status(ERROR_SERVER_CODE).send({ message: err.message });
// });
