const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  WRONG_DATA_CODE, // 400
  UNAUTHORIZED, // 401
  NOT_FOUND_CODE, // 404
  ERROR_SERVER_CODE, // 500
} = require('../utils/constants');

//  Создаем пользователя  //
const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    res.status(WRONG_DATA_CODE).send({ message: 'password or email empty' });
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(WRONG_DATA_CODE).send({ message: 'Ошибка валидации' });
        return;
      }
      res.status(ERROR_SERVER_CODE).send({ message: err.message });
    });
};

//  Получаем всех пользователей  //
const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(ERROR_SERVER_CODE).send({ message: err.message });
    });
};

//  Получаем пользователя по ID  //
const getUserById = (req, res) => {
  User.findById(req.params.userId).orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь с указанным _id не найден' });
      }
      if (err.name === 'CastError') {
        return res.status(WRONG_DATA_CODE).send({ message: 'Некорректный _id из getUserById', err });
      }
      return res.status(ERROR_SERVER_CODE).send({ message: err.message });
    });
};

//  Получаем текущего пользователя  //
const getCurrentUser = (req, res) => {
  User.findById(req.user._id).orFail(new Error('NotFound'))
    .then((user) => {
      if (!user) {
        return res.status(UNAUTHORIZED).send('Not correct data');
      }
      return res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь с указанным _id не найден' });
      }
      if (err.name === 'CastError') {
        return res.status(WRONG_DATA_CODE).send({ message: 'Некорректный _id', err });
      }
      return res.status(ERROR_SERVER_CODE).send({ message: err.message });
    });
};

//  Обновляем профиль  //
const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_CODE).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(WRONG_DATA_CODE).send({ message: 'Некорректный _id', err });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(WRONG_DATA_CODE).send({ message: 'Ошибка валидации' });
      }
      return res.status(ERROR_SERVER_CODE).send({ message: err.message });
    });
};

//  Обновляем аватар  //
const updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_CODE).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(WRONG_DATA_CODE).send({ message: 'Ошибка валидации', err });
        return;
      }
      res.status(ERROR_SERVER_CODE).send({ message: err.message });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getCurrentUser,
  updateProfile,
  updateAvatar,
};
