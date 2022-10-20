const { default: mongoose } = require('mongoose');
const User = require('../models/user');
const {
  WRONG_DATA_CODE, // 400
  NOT_FOUND_CODE, // 404
  ERROR_SERVER_CODE, // 500
} = require('../utils/constants');

//  Создаем пользователя  //
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user });
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
  updateProfile,
  updateAvatar,
};
