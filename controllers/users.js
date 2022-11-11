const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../utils/errors/NotFoundError'); // 404
const ValidationError = require('../utils/errors/ValidationError'); // 400
const AuthError = require('../utils/errors/AuthError'); // 401
const UserExistError = require('../utils/errors/UserExistError'); // 409

//  Создаем пользователя  //
const createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    next(new ValidationError('password or email empty'));
    return;
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      next(new UserExistError('Пользователь с таким email уже зарегистрирован'));
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        email,
        password: hashPassword,
        name,
        about,
        avatar,
      });
      const {
        name: userName, about: userAbout, avatar: userAvatar, email: userEmail,
      } = newUser;
      res.status(200).send({
        user: {
          name: userName, about: userAbout, avatar: userAvatar, email: userEmail,
        },
      });
    }
  } catch (err) {
    console.log(err);
    if (err.name === 'ValidationError') {
      next(new ValidationError('Not correct data'));
      return;
    }
    if (err.code === 11000) {
      next(new UserExistError(`${req.body.email} - такой пользователь уже зарегистрирован`));
      return;
    }
    next(err);
  }
};

//  Получаем всех пользователей  //
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      next(err);
    });
};

//  Получаем пользователя по ID  //
const getUserById = (req, res, next) => {
  User.findById(req.params.userId).orFail(new Error('NotFound'))
    .then((user) => {
      if (!user) {
        next(new NotFoundError(`Пользователь с id ${req.params.userId} не найден`));
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Not correct data'));
      }
      next(err);
    });
};

//  Получаем текущего пользователя  //
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id).orFail(new Error('NotFound'))
    .then((user) => {
      if (!user) {
        return next(new AuthError('Not correct data'));
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
        return next(new NotFoundError('User with this id not found'));
      }
      if (err.name === 'CastError') {
        return next(new ValidationError('Not correct data'));
      }
      return next(err);
    });
};

//  Обновляем профиль  //
const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('User with this id not found'));
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new ValidationError('Not correct data'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new ValidationError('Not correct data'));
      }
      return next(err);
    });
};

//  Обновляем аватар  //
const updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('User with this id not found'));
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Not correct data'));
      }
      return next(err);
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
